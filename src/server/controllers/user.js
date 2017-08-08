import User from 'models/user';


const debug = require('debug')('mp-user-controller');

export async function create(req, res, next) {
  console.log('create user');
  debug('create');
  const payload = req.body;
  try {
    console.log('create user before');
    const user = await User.create(payload);
    console.log('create user after');
    res.json(user);
  }
  catch (error) {
    console.log('error');
    console.log(error);
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

export async function replace(req, res, next ) {
  debug('replace');

  const payload = req.body;
  const id = req.params.id;
  try {
    await User.replaceOne(
      { _id: id },
      payload
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

