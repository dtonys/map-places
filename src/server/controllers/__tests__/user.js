/**
 * @jest-environment node
 */

import getPort from 'get-port';
import User from 'models/user';
import {
  setupTestEnvironment,
  teardownTestEnvironment,
} from 'helpers/testUtils';


describe('User API tests', () => {

  let webApiRequest = null;
  let port = null;

  // Bootstrap application in test mode
  beforeAll(async (done) => {
    port = await getPort();
    webApiRequest = await setupTestEnvironment(port);
    done();
  });

  // Drop temp test database
  afterAll( async (done) => {
    teardownTestEnvironment(port);
    done();
  });

  test('POST `/api/users` creates a new user', async () => {
    const testUserPayload = {
      first_name: 'created_first',
      last_name: 'created_last',
      email: 'created_user@test.com',
    };
    const response = await webApiRequest(
      'POST', '/api/users', {
        body: testUserPayload,
      }
    );
    expect(response.data.first_name).toBe(testUserPayload.first_name);

    const queriedUser = await User.findOne({ _id: response.data._id });
    expect(queriedUser.first_name).toBe(testUserPayload.first_name);
  });

  test('PATCH `/api/users/:id` updates a user', async () => {
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
    expect( response.data.first_name ).toBe(updates.first_name);
    const queriedUser = await User.findOne({ _id: response.data._id });
    expect( queriedUser.first_name ).toBe(updates.first_name);
  });

  test('GET `/api/users/:id` gets a user', async () => {
    const testUserPayload = {
      first_name: 'get_first',
      last_name: 'get_last',
      email: 'get_user@test.com',
    };
    const createdUser = await User.create(testUserPayload);
    const response = await webApiRequest(
      'GET', `/api/users/${createdUser._id.toString()}`
    );
    expect( response.data.first_name ).toBe(testUserPayload.first_name);
    const queriedUser = await User.findOne({ _id: response.data._id });
    expect( queriedUser.first_name ).toBe(testUserPayload.first_name);
  });

  test('GET `/api/users` gets a list of users', async () => {
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
    expect(response.data.items.length >= 2).toBe(true);
    expect(response.data.items[0].first_name).toBeTruthy();
    expect(response.data.items[0].last_name).toBeTruthy();
    expect(response.data.items[0].email).toBeTruthy();

    const users = await User.find();
    expect(users.length >= 2).toBe(true);
  });

  test('DELETE `/api/users/:id` deletes a user', async () => {
    const testUserPayload = {
      first_name: 'delete_first',
      last_name: 'delete_last',
      email: 'delete_user@test.com',
    };
    const user = await User.create(testUserPayload);
    const newUser = await User.findOne({ _id: user._id.toString() });
    expect(newUser !== null).toBe(true);
    const response = await webApiRequest(
      'DELETE', `/api/users/${user._id.toString()}`
    );
    expect( response.data.first_name === 'delete_first' ).toBe(true);
    const queriedUser = await User.findOne({ _id: user._id.toString() });
    expect( queriedUser === null ).toBe(true);
  });

});
