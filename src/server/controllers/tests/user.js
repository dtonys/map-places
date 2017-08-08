import test from 'ava';
import { MongoDBServer } from 'mongomem';
import supertest from 'supertest';

import {
  nextMock,
} from 'helpers/test'
import {
  registerMongooseModels,
  setupTestMongoose,
} from 'helpers/mongo';
import {
  createExpressApp,
} from 'helpers/express';


test.before('start mongodb memory server', async (t) => {
  await MongoDBServer.start();
});

test.beforeEach('setup mongoose and express', async (t) => {
  const expressApp = await createExpressApp( nextMock )
  const request = supertest(expressApp);
  registerMongooseModels();
  const db = await setupTestMongoose();
  t.context.db = db;
  t.context.request = request;
  console.log('test.beforeEach');
});

test.serial('POST `/api/users/create` creates a new user', async (t) => {
  const {
    db,
    request,
  } = t.context;

  console.log('sending request');
  const apiRequest = request
    .post('/api/users')
    .send({ email: 'test@test.com' })
    .expect(200)
    .then((err, response) => {
      console.log('response recieved');
      if ( err ) {
        console.log('err');
        console.log(err);
        throw err;
      }
      console.log('response.body');
      console.log(response.body);
      t.pass();
    });
  await apiRequest;

  // const { db, request } = t.context;
  // const User = db.model('user');
  // const user = await User.create({
  //   first_name: 'test',
  //   last_name: 'person',
  //   email: 't@test.test'
  // });

  // const queriedUser = await User.findOne({ email: 't@test.test' });
  // t.is( user.first_name, queriedUser.first_name, 'should be able to save a new user' );
  // t.pass();
});





