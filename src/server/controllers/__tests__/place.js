import mongoose from 'mongoose';
import getPort from 'get-port';

import {
  nextMock,
} from 'helpers/nextMock';
import {
  setupMongoose,
  buildAllIndexes,
} from 'helpers/mongo';
import Place from 'models/place';
import {
  createExpressApp,
  startExpressServer,
} from 'helpers/express';
import { createMockWebApiRequest } from 'web-api/webApiRequest';
import loadEnv from '../../loadEnv';


describe('User API tests', () => {

  let webApiRequest = null;

  // Bootstrap application in test mode
  beforeAll(async (done) => {
    const port = await getPort();
    loadEnv();
    await setupMongoose(`mapplaces_test_${port}`);
    await buildAllIndexes();
    const expressApp = await createExpressApp(nextMock);
    await startExpressServer(expressApp, port);
    console.log(`Server ready on http://localhost:${port}`); // eslint-disable-line no-console
    webApiRequest = createMockWebApiRequest(port);
    done();
  });

  // Drop temp test database
  afterAll( async (done) => {
    console.log('dropping database');
    await mongoose.connection.db.dropDatabase();
    done();
  });

  test('POST `/api/places` creates a new place', async () => {
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
    expect(response.data.name).toBe(testPlacePayload.name);
    const queriedPlace = await Place.findOne({ _id: response.data._id });
    expect(queriedPlace.name).toBe(testPlacePayload.name);
  });

  test('PATCH `/api/places/:id` updates a place', async () => {
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
    expect(updates.name).toBe(response.data.name);

    const queriedUser = await Place.findOne({ _id: response.data._id });
    expect(queriedUser.name).toBe(response.data.name);
  });

  test('GET `/api/places/:id` gets a place', async () => {
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
    expect(response.data.name).toBe(testPlacePayload.name);
    const queriedPlace = await Place.findOne({ _id: response.data._id });
    expect(queriedPlace.name).toBe(testPlacePayload.name);
  });

  test('GET `/api/places` gets a list of places', async () => {
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
    expect(response.data.items.length >= 2).toBe(true);
    expect(response.data.items[0].coordinates).toBeTruthy();
    expect(response.data.items[0].name).toBeTruthy();

    const places = await Place.find();
    expect(places.length >= 2).toBe(true);
  });

  test('DELETE `/api/places/:id` deletes a place', async () => {
    const testPlacePayload = {
      coordinates: [
        100.01,
        67.56,
      ],
      name: 'created_place',
    };
    const place = await Place.create(testPlacePayload);
    const newPlace = await Place.findOne({ _id: place._id.toString() });
    expect( newPlace !== null ).toBe(true);
    const response = await webApiRequest(
      'DELETE', `/api/places/${place._id.toString()}`
    );
    expect( response.data.name === 'created_place' ).toBe(true);
    const queriedUser = await Place.findOne({ _id: place._id.toString() });
    expect(queriedUser === null).toBe(true);
  });

});
