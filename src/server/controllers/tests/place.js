import test from 'ava';
import mongoose from 'mongoose';

import {
  nextMock,
} from 'helpers/test';
import {
  setupMongoose,
  buildAllIndexes,
} from 'helpers/mongo';
import Place from 'models/place';
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

test.serial('POST `/api/places` creates a new place', async (t) => {
  const testPlacePayload = {
    coordinates: [
      100.01,
      67.56,
    ],
    name: 'created_place',
  };
  const response = await webApiRequest(
    'POST', '/api/places', {
      body: testPlacePayload,
    }
  );
  t.is(response.data.name, testPlacePayload.name, 'response contains created place');

  const queriedPlace = await Place.findOne({ _id: response.data._id });
  t.is(queriedPlace.name, testPlacePayload.name, 'response contains created place');
});
test.serial('PATCH `/api/places/:id` updates a place', async (t) => {
  const testPlacePayload = {
    coordinates: [
      100.01,
      67.56,
    ],
    name: 'created_place',
  };
  const createdPlace = await Place.create(testPlacePayload);
  const updates = {
    name: 'updated_name',
  };
  const response = await webApiRequest(
    'PATCH', `/api/places/${createdPlace._id.toString()}`, {
      body: updates,
    }
  );
  t.is(updates.name, response.data.name, 'response shows updates');

  const queriedUser = await Place.findOne({ _id: response.data._id });
  t.is(queriedUser.name, response.data.name, 'database shows updates');
});
test.serial('GET `/api/places/:id` gets a place', async (t) => {
  const testPlacePayload = {
    coordinates: [
      100.01,
      67.56,
    ],
    name: 'created_place',
  };
  const createdPlace = await Place.create(testPlacePayload);
  const response = await webApiRequest(
    'GET', `/api/places/${createdPlace._id.toString()}`
  );
  t.is(response.data.name, testPlacePayload.name, 'response shows the updates');

  const queriedPlace = await Place.findOne({ _id: response.data._id });
  t.is(queriedPlace.name, testPlacePayload.name, 'database shows the updates');
});

test.serial('GET `/api/places` gets a list of places', async (t) => {
  const testPlacePayload1 = {
    coordinates: [
      100.01,
      67.56,
    ],
    name: 'created_place_1',
  };
  const testPlacePayload2 = {
    coordinates: [
      100.01,
      67.56,
    ],
    name: 'created_place_2',
  };

  await Promise.all([
    Place.create(testPlacePayload1),
    Place.create(testPlacePayload2),
  ]);
  const response = await webApiRequest(
    'GET', '/api/places'
  );
  t.true( response.data.items.length === 2, 'response contains multiple elements');
  t.truthy(
    ( response.data.items[0].coordinates &&
      response.data.items[0].name
    ), 'The elements are of the model type'
  );
  const places = await Place.find();
  t.true( places.length === 2, 'database contains a list of places' );
});

test.serial('DELETE `/api/places/:id` deletes a place', async (t) => {
  const testPlacePayload = {
    coordinates: [
      100.01,
      67.56,
    ],
    name: 'created_place',
  };
  const place = await Place.create(testPlacePayload);
  const newPlace = await Place.findOne({ _id: place._id.toString() });
  t.true( newPlace !== null, 'database can get the new place');
  const response = await webApiRequest(
    'DELETE', `/api/places/${place._id.toString()}`
  );
  t.true( response.data === null, 'delete response has null data' );

  const queriedUser = await Place.findOne({ _id: place._id.toString() });
  t.true( queriedUser === null, 'database cannot get the deleted user');
});

