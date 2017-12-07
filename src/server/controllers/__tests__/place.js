/**
 * @jest-environment node
 */

import getPort from 'get-port';
import Place from 'models/place';
import {
  setupTestEnvironment,
  teardownTestEnvironment,
} from 'helpers/testUtils';

describe('Place API tests', () => {

  let webApiRequest = null;
  let port = null;

  // Bootstrap application in test mode
  beforeAll(async (done) => {
    port = await getPort();
    webApiRequest = await setupTestEnvironment(port);
    done();
  });

  // Drop temp test database
  afterAll(async (done) => {
    teardownTestEnvironment(port);
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
