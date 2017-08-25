import fs from 'fs';
import path from 'path';

import nodemailer from 'nodemailer';
import { mjml2html } from 'mjml';
import { createSession } from 'helpers/session';
import User from 'models/user';


let gmailTransport = null;
const templates = {};
export function initialize() {
  // create transport
  gmailTransport = nodemailer.createTransport(
    `smtps://${process.env.MAILER_EMAIL}:${process.env.MAILER_PASSWORD}@smtp.gmail.com`
  );
  // Load templates into variable
  const templateFiles = fs.readdirSync( path.resolve(__dirname, './templates') );
  templateFiles.forEach((templateFile) => {
    const templateName = templateFile.replace('.mjml', '');
    const templateStr = fs.readFileSync( path.resolve(__dirname, './templates/', templateFile), 'utf8' );
    templates[templateName] = templateStr;
  });
}

// NOTE: name of the function should match name of the template
export async function verifySignupEmail( email ) {
  // create link with `/api/verify-email?sessionToken=<hash>`;
  const user = await User.findOne({ email: email });
  if ( !user ) {
    console.log(`verifySignupEmail: ${email} not found`);
    return;
  }
  const session = await createSession( user._id.toString() );

  const urlbase = process.env.SERVER_URL_BASE;
  const verifyLink = `${urlbase}/api/verify-email?sessionToken=${session._id}`;

  // get and render template
  // templates.verifyEmail;

  const mailOptions = {
    from: '"MapPlaces" <mapplacesemail@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Email Verification',
    html: `<a href=${verifyLink}>Click here to verify your email</a>`,
  };
  gmailTransport.sendMail( mailOptions, ( err, info ) => {
    if ( err ) {
      console.log(err);
      return;
    }
    console.log('Message sent: ' + info.response );
  });
}
