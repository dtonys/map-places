import test from 'ava';
import mongoose from 'mongoose';


import {
  nextMock,
} from 'helpers/test';
import {
  setupMongoose,
  buildAllIndexes,
} from 'helpers/mongo';
import User from 'models/user';
import {
  createExpressApp,
  startExpressServer,
} from 'helpers/express';
import webApiRequest from 'web-api/webApiRequest';
import loadEnv from '../../loadEnv';


test.before('Bootstrap application in test mode', async () => {
  loadEnv();
  await setupMongoose('mapplaces_test');
  const expressApp = await createExpressApp(nextMock);
  const serverListener = await startExpressServer(expressApp);
  console.log(`Server ready on http://localhost:${serverListener.address().port}`); // eslint-disable-line no-console
});

test.beforeEach('Clear database state before each test', async (/* t */) => {
  const db = mongoose.connection;
  for ( const collectionName of Object.keys(db.collections) ) {
    try {
      await db.collections[collectionName].drop(); // eslint-disable-line no-await-in-loop
    }
    catch ( error ) {
      // IGNORE_EXCEPTION
    }

  }
  await buildAllIndexes();
});

test.serial('POST `/api/users` creates a new user', async (t) => {
  const testUserPayload = {
    first_name: 'created_first',
    last_name: 'created_last',
    email1: 'created_user@test.com',
  };
  const response = await webApiRequest(
    'POST', '/api/users', {
      body: testUserPayload,
    }
  );
  t.is(response.data.first_name, testUserPayload.first_name, 'response contains created user');

  const queriedUser = await User.findOne({ _id: response.data._id });
  t.is(queriedUser.first_name, testUserPayload.first_name, 'database contains created user');
});

test.serial('PATCH `/api/users/:id` updates a user', async (t) => {
  const testUserPayload = {
    first_name: 'original_first',
    last_name: 'original_last',
    email: 'original_user@test.com',
  };
  const createdUser = await User.create(testUserPayload);
  const updates = {
    first_name: 'updated_first',
  };
  const response = await webApiRequest(
    'PATCH', `/api/users/${createdUser._id.toString()}`, {
      body: updates,
    },
  );
  t.is(response.data.first_name, updates.first_name, 'response shows the updates');

  const queriedUser = await User.findOne({ _id: response.data._id });
  t.is(queriedUser.first_name, updates.first_name, 'database shows the updates');
});

test.serial('GET `/api/users/:id` gets a user', async (t) => {
  const testUserPayload = {
    first_name: 'get_first',
    last_name: 'get_last',
    email: 'get_user@test.com',
  };
  const createdUser = await User.create(testUserPayload);
  const response = await webApiRequest(
    'GET', `/api/users/${createdUser._id.toString()}`
  );
  t.is(response.data.first_name, testUserPayload.first_name, 'response shows the updates');

  const queriedUser = await User.findOne({ _id: response.data._id });
  t.is(queriedUser.first_name, testUserPayload.first_name, 'database shows the updates');
});

test.serial('GET `/api/users` gets a list of users', async (t) => {
  const testUserPayload1 = {
    first_name: '1_first',
    last_name: '1_last',
    email: '1_user@test.com',
  };
  const testUserPayload2 = {
    first_name: '2_first',
    last_name: '2_last',
    email: '2_user@test.com',
  };
  await Promise.all([
    User.create(testUserPayload1),
    User.create(testUserPayload2),
  ]);
  const response = await webApiRequest(
    'GET', '/api/users'
  );
  t.true( response.data.items.length === 2, 'response contains multiple elements');
  t.truthy(
    ( response.data.items[0].first_name &&
      response.data.items[0].last_name &&
      response.data.items[0].email
    ), 'The elements are of the model type'
  );
  const users = await User.find();
  t.true( users.length === 2, 'database contains a list of users' );
});

test.serial('DELETE `/api/users/:id` deletes a user', async (t) => {
  const testUserPayload = {
    first_name: 'delete_first',
    last_name: 'delete_last',
    email: 'delete_user@test.com',
  };
  const user = await User.create(testUserPayload);
  const newUser = await User.findOne({ _id: user._id.toString() });
  t.true( newUser !== null, 'database can get the new user');
  const response = await webApiRequest(
    'DELETE', `/api/users/${user._id.toString()}`
  );
  t.true( response.data === null, 'delete response has null data' );
  const queriedUser = await User.findOne({ _id: user._id.toString() });
  t.true( queriedUser === null, 'database cannot get the deleted user');
});
