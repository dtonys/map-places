import fs from 'fs';
import path from 'path';
import EventEmitter from 'event-emitter';

import lodashTemplate from 'lodash/template';
import nodemailer from 'nodemailer';
import { mjml2html } from 'mjml';
import { createSession } from 'helpers/session';
import User from 'models/user';
import Place from 'models/place';


let gmailTransport = null;
const emailTemplates = {};
const emailPartials = {};
export function initialize() {
  // create transport
  gmailTransport = nodemailer.createTransport(
    `smtps://${process.env.MAILER_EMAIL}:${process.env.MAILER_PASSWORD}@smtp.gmail.com`
  );
  // Load email templates
  const templateFiles = fs.readdirSync( path.resolve(__dirname, './templates') );
  templateFiles.forEach((templateFile) => {
    const templateName = templateFile.replace('.mjml', '');
    let mjmlString = null;
    // NOTE: try catch for when trying to read directories
    try {
      mjmlString = fs.readFileSync( path.resolve(__dirname, './templates/', templateFile), 'utf8' );
    }
    catch ( err ) {
      return;
    }
    emailTemplates[templateName] = ( dataObject ) => {
      const mjmlCompiled = lodashTemplate(mjmlString)(dataObject);
      const htmlOutput = mjml2html(mjmlCompiled);
      if ( htmlOutput.errors.length ) {
        console.log('mjml2html errors: '); // eslint-disable-line no-console
        console.log(htmlOutput.errors); // eslint-disable-line no-console
      }
      return htmlOutput.html;
    };
  });
  // Load email template partials
  const partialFiles = fs.readdirSync( path.resolve(__dirname, './templates/partials') );
  partialFiles.forEach((partialFile) => {
    const templateName = partialFile.replace('.mjml', '');
    let mjmlString = null;
    // NOTE: try catch for when trying to read directories
    try {
      mjmlString = fs.readFileSync( path.resolve(__dirname, './templates/partials', partialFile), 'utf8' );
    }
    catch ( err ) {
      return;
    }
    emailPartials[templateName] = ( dataObject ) => {
      return lodashTemplate(mjmlString)(dataObject);
    };
  });
  // Hack to expose emailPartials to allow ejs partials to invoke other partials
  global.emailPartials = emailPartials;
}

export function renderEmail( req, res ) {
  const mailName = req.params.mailName;
  const mjmlString = fs.readFileSync( path.resolve(__dirname, './templates/', mailName + '.mjml'), 'utf8' );
  const mockData =  { data: {
    top3Places: [
      { name: 'Place 1' },
      { name: 'Place 2' },
      { name: 'Place 3' },
    ],
    email: 'test@test.com',
    first_name: 'test_first',
  } };
  const mjmlCompiled = lodashTemplate(mjmlString)(mockData);
  const mjmlOutput = mjml2html(mjmlCompiled);

  res.send(mjmlOutput.html);
}

const MAIL_SENT_TIMEOUT = 5000;
export const MAIL_SENT_EVENT = 'mail:send';
export const mailEmitter = new EventEmitter();

// Use this if we need access to a list of mail items
export function collectMail() {
  const mailArray = [];
  function handler(mailHtml) {
    mailArray.push(mailHtml);
  }
  mailEmitter.on(MAIL_SENT_EVENT, handler);
  return () => (mailArray);
}

// Creates one-off promise that waits for the next incoming mail request
// Returns html of the mail.
// Useful for tests to wait for the next mail.
export function onNextMailSent() {
  return new Promise((resolve, reject) => {
    function handler(mailHtml) {
      resolve(mailHtml);
      mailEmitter.off(MAIL_SENT_EVENT, handler);
    }
    mailEmitter.on(MAIL_SENT_EVENT, handler);
    // Timeout incase emails is not sent
    setTimeout(() => {
      reject();
    }, MAIL_SENT_TIMEOUT);
  });
}

function sendMail({
  from = '"MapPlaces" <mapplacesemail@gmail.com>',
  toEmailArray,
  subject,
  html,
}) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from, // sender address
      to: toEmailArray.join(', '), // list of receivers
      subject,
      html,
    };
    // lastSentMailHtml = html;
    gmailTransport.sendMail( mailOptions, ( err, info ) => {
      if ( err ) {
        console.log(err); // eslint-disable-line no-console
        reject(err);
        return;
      }
      console.log('Message sent: ' + info.response ); // eslint-disable-line no-console
      mailEmitter.emit(MAIL_SENT_EVENT, html);
      resolve();
    });
  });
}

// NOTE: name of the function should match name of the template
export async function verifySignupEmail( email ) {
  // create link with `/api/verify-email?sessionToken=<hash>`;
  const user = await User.findOne({ email: email });
  if ( !user ) {
    console.log(`verifySignupEmail: ${email} not found`); // eslint-disable-line no-console
    return;
  }
  // Create session
  const session = await createSession( user._id.toString() );
  const sessionId = session._id.toString();
  // Send token out to auth the verify-email api
  const verifyLink = `${process.env.SERVER_URL_BASE}/api/verify-email?sessionToken=${sessionId}`;
  const html = emailTemplates['verifyEmail']({ data: {
    email: user.email,
    first_name: user.first_name,
    verifyLink: verifyLink,
  } });
  if ( !html ) {
    return;
  }

  await sendMail({
    toEmailArray: [ email ],
    subject: 'Email Verification',
    html: html,
  });
}

export async function resetPasswordEmail( email ) {
  const user = await User.findOne({ email: email });
  if ( !user ) {
    console.log(`verifySignupEmail: ${email} not found`); // eslint-disable-line no-console
    return;
  }

  // Create session
  const session = await createSession( user._id.toString() );
  const sessionId = session._id.toString();
  // Save one session per user
  user.set({ reset_password_token: sessionId });
  await user.save();
  // Send the token out, one time use.
  const resetLink = `${process.env.SERVER_URL_BASE}/reset-password?sessionToken=${sessionId}`;
  const html = emailTemplates['resetPassword']({ data: {
    email: user.email,
    first_name: user.first_name,
    resetLink: resetLink,
  } });
  await sendMail({
    toEmailArray: [ email ],
    subject: 'Reset Password',
    html: html,
  });
}

export async function featuredPlacesNewsletter( email ) {
  const top3Places = await Place.find().sort({ _id: -1 }).limit(3);
  const html = emailTemplates['featuredPlaces']({ data: {
    top3Places: top3Places,
  } });
  await sendMail({
    toEmailArray: [ email ],
    subject: 'Featured Places',
    html: html,
  });
}

