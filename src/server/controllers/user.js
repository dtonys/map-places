import User from 'models/user';
import bcrypt from 'bcrypt';

import {
  createSessionWithCookie,
  getCurrentSessionAndUser,
  deleteSession,
} from 'helpers/session';
import {
  SESSION_COOKIE_NAME,
} from 'models/session';


const debug = require('debug')('mp-user-controller');

export async function create(req, res, next) {
  debug('create');
  const payload = req.body;
  try {
    const user = await User.create(payload);
    res.json(user);
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
    res.json(updatedUser);
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
    res.json(user);
  }
  catch (error) {
    next(error);
  }
}

export async function list(req, res, next ) {
  debug('list');
  try {
    const users = await User.find();
    res.json(users);
  }
  catch (error) {
    next(error);
  }
}

export async function remove(req, res, next ) {
  debug('delete');
  const id = req.params.id;
  try {
    await User.findOneAndRemove({ _id: id });
    res.json({
      success: true,
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
    // Existing user error
    res.json({
      success: false,
      message: 'existing user error',
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
    });
    // return user
    res.json(user);
    return;
  }
  catch ( error ) {
    next( error );
  }
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
    if ( user ) {
      const validPassword = bcrypt.compareSync(password, user.password_hash);
      if ( validPassword ) {
        try {
          await createSessionWithCookie( user._id.toString(), res );
        }
        catch ( error ) {
          next(error);
          return;
        }
        // login success
        res.json({
          success: true,
          message: 'login success',
        });
        return;
      }
      // wrong password
      res.json({
        success: false,
        message: 'Invalid email and password combination ( wrong password )',
      });
      return;
    }
    // user not found
    res.json({
      success: false,
      message: 'Invalid email and password combination ( user not found )',
    });
    return;
  }
  catch ( error ) {
    next( error );
  }
}

export async function logout(req, res, next) {
  debug('logout');
  const sessionId = req.cookies[SESSION_COOKIE_NAME];
  if ( sessionId ) {
    try {
      await deleteSession(sessionId);
      res.clearCookie(SESSION_COOKIE_NAME);
    }
    catch ( error ) {
      next(error);
      return;
    }
  }
  res.json({
    success: true,
  });
}

export async function sessionInfo(req, res, next) {
  debug('sessionInfo');
  const sessionId = req.cookies[SESSION_COOKIE_NAME];
  if ( !sessionId ) {
    res.json({
      session: null,
      user: null,
      success: false,
      message: 'No active session',
    });
    return;
  }
  const { user, session } = await getCurrentSessionAndUser( sessionId );
  if ( !user || !session ) {
    res.json({
      session: null,
      user: null,
      success: false,
      message: 'No active session',
    });
    return;
  }
  try {
    res.json({
      user,
      session,
    });
  }
  catch ( error ) {
    next(error);
  }
}

