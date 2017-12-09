import User, {
  USER_ROLE_MEMBER,
} from 'models/user';
import bcrypt from 'bcrypt';

import {
  createSessionWithCookie,
  getCurrentSessionAndUser,
  deleteSession,
} from 'helpers/session';
import {
  SESSION_COOKIE_NAME,
} from 'models/session';
import * as mailer from 'email/mailer';


const debug = require('debug')('mp-user-controller');

export async function create(req, res, next) {
  debug('create');
  const payload = req.body;
  try {
    const user = await User.create(payload);
    res.json({
      data: user,
    });
  }
  catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  debug('update');
  const payload = req.body;
  const id = req.params.id;
  try {
    await User.update(
      { _id: id },
      payload,
    );
    const updatedUser = await User.findById(id);
    res.json({
      data: updatedUser,
    });
  }
  catch (error) {
    next(error);
  }
}

export async function get(req, res, next ) {
  debug('get');
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    res.json({
      data: user,
    });
  }
  catch (error) {
    next(error);
  }
}

export async function list(req, res, next ) {
  debug('list');
  try {
    const users = await User.find();
    res.json({
      data: {
        items: users,
      },
    });
  }
  catch (error) {
    next(error);
  }
}

export async function remove(req, res, next ) {
  debug('delete');
  const id = req.params.id;
  try {
    const deletedUser = await User.findOneAndRemove({ _id: id });
    res.json({
      data: deletedUser,
    });
  }
  catch (error) {
    next(error);
  }
}

export async function signup( req, res, next ) {
  debug('signup');
  const {
    email,
    password,
    first_name,
    last_name,
  } = req.body;

  // check if user already exists with email
  const existingUser = await User.findOne({ email: email });
  if ( existingUser ) {
    res.status(422);
    res.json({
      error: [ {
        message: 'User email already in use',
      } ],
    });
    return;
  }
  try {
    // salt and hash password
    const passwordHash = bcrypt.hashSync(password, 10);
    // create user, not email verified
    const user = await User.create({
      email: email,
      first_name: first_name,
      last_name: last_name,
      password_hash: passwordHash,
      roles: [ USER_ROLE_MEMBER ],
    });
    // Send verification email
    mailer.verifySignupEmail( email );
    // log user in
    await createSessionWithCookie( user._id.toString(), res );
    // return user
    res.json({
      data: user,
    });
    return;
  }
  catch ( error ) {
    next( error );
  }
}

export async function verifyEmail( req, res ) {
  const sessionToken = req.query.sessionToken;
  const { user, session } = await getCurrentSessionAndUser( sessionToken );
  if ( !user || !session ) {
    console.log('User not found or invalid session');
    res.redirect('/');
    return;
  }
  // set user as verified
  user.set({ is_email_verified: true });
  await user.save();
  // destroy the session
  await session.remove();

  // log user in
  await createSessionWithCookie( user._id.toString(), res );
  // redirect to home page
  res.redirect('/');
}

export async function login(req, res, next) {
  debug('login');
  const {
    email,
    password,
  } = req.body;

  // find user by email
  try {
    const user = await User.findOne({ email: email });
    if ( !user ) {
      // user not found
      res.status(404);
      res.json({
        error: [ {
          message: 'Email not found',
        } ],
      });
      return;
    }
    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if ( !validPassword ) {
      // wrong password
      res.status(422);
      res.json({
        error: [ {
          message: 'Wrong password',
        } ],
      });
      return;
    }
    // log user in
    await createSessionWithCookie( user._id.toString(), res );
    // login success
    res.json({
      data: user,
    });
    return;
  }
  catch ( error ) {
    next( error );
  }
}

export async function lostPassword(req, res) {
  const payload = req.body;
  const user = await User.findOne({ email: payload.email });
  if ( !user ) {
    // user not found
    res.status(404);
    res.json({
      error: [ {
        message: 'Email not found',
      } ],
    });
    return;
  }
  await mailer.resetPasswordEmail( user.email );
  res.json({
    data: null,
  });
}

export async function resetPassword(req, res) {
  const payload = req.body;
  const { user, session } = await getCurrentSessionAndUser( payload.sessionToken );
  if ( !session || !user ) {
    res.status(422);
    res.json({
      error: [ {
        message: 'Invalid or expired session.',
      } ],
    });
    return;
  }
  if ( user.reset_password_token !== payload.sessionToken ) {
    res.status(422);
    res.json({
      error: [ {
        message: 'Invalid or expired session.',
      } ],
    });
    return;
  }

  // validate args
  const validationErrors = [
    'password',
    'passwordConfirm',
  ].map(( requiredField ) => {
    if ( !payload[requiredField] ) {
      return { message: `${requiredField} is required.` };
    }
    return null;
  }).filter((error) => !!error);
  if ( payload.password !== payload.passwordConfirm ) {
    validationErrors.push({ message: 'Password and confirm must match.' });
  }
  if ( validationErrors.length ) {
    res.status(422);
    res.json({
      error: validationErrors,
    });
    return;
  }

  // set the new password
  const passwordHash = bcrypt.hashSync(payload.password, 10);
  user.set({
    password_hash: passwordHash,
    reset_password_token: null,
  });
  await user.save();
  // destroy the session
  await session.remove();

  // done
  res.json({
    data: null,
  });
}

export async function logout(req, res, next) {
  debug('logout');
  const sessionId = req.cookies[SESSION_COOKIE_NAME];
  if ( sessionId ) {
    try {
      await deleteSession(sessionId);
      res.clearCookie(SESSION_COOKIE_NAME);
      res.json({
        data: null,
      });
      return;
    }
    catch ( error ) {
      next(error);
      return;
    }
  }
  res.json({
    data: null,
  });
}

export async function sessionInfo(req, res, next) {
  debug('sessionInfo');
  const sessionId = req.cookies[SESSION_COOKIE_NAME];
  if ( !sessionId ) {
    res.json({
      data: null,
    });
    return;
  }
  const { user, session } = await getCurrentSessionAndUser( sessionId );
  if ( !user || !session ) {
    res.json({
      data: null,
    });
    return;
  }
  try {
    res.json({
      data: {
        currentUser: user,
        currentSession: session,
      },
    });
    return;
  }
  catch ( error ) {
    next(error);
  }
}

