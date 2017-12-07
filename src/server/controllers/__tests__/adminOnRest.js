/**
 * @jest-environment node
 */
import getPort from 'get-port';
import User from 'models/user';
import faker from 'faker';
import {
  setupTestEnvironment,
  teardownTestEnvironment,
} from 'helpers/testUtils';

function generateFakeUsers( num ) {
  const fakeUsers = [];
  for ( let i = 0; i < num; i++ ) {
    fakeUsers.push({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
  }
  return fakeUsers;
}

describe('Admin on rest API, via simpleRestClient specifications', () => {
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

  // Drop users collection after each test
  afterEach(async (done) => {
    try {
      await User.collection.drop();
    }
    catch ( error ) {
      // IGNORE_EXCEPTION
    }
    done();
  });

  /* /<resource> */
  test('GET_LIST gets a list of resources', async (done) => {
    await User.insertMany( generateFakeUsers(4) );
    const response = await webApiRequest('GET', '/aor-api/users');
    expect( response.length ).toBe(4);
    done();
  });

  /* /<resource>?sort=['title','ASC']&filter={title:'bar'} */
  test('GET_LIST respects sort and filter params', async (done) => {
    let response = null;
    const users =  [
      { first_name: 'Zed', email: 'zed@s1.com' },
      { first_name: 'Steve', email: 'steve2@s1.com' },
      { first_name: 'Steve', email: 'steve1@s1.com' },
      { first_name: 'Amy', email: 'amy@s1.com' },
    ];
    await User.insertMany( users );
    // sort param should work
    response = await webApiRequest('GET',
      "/aor-api/users?sort=['first_name','ASC']"
    );
    expect(response[0].first_name).toBe('Amy');
    expect(response[response.length - 1].first_name).toBe('Zed');

    // filter params should work
    response = await webApiRequest('GET',
      "/aor-api/users?filter={first_name:'Steve'}"
    );
    expect(response.length).toBe(2);
    expect(response[0].first_name).toBe('Steve');
    expect(response[1].first_name).toBe('Steve');

    // sort and filter params should work together
    response = await webApiRequest('GET',
      "/aor-api/users?sort=['email','ASC']&filter={first_name:'Steve'}"
    );
    expect(response.length).toBe(2);
    expect(response[0].first_name).toBe('Steve');
    expect(response[1].first_name).toBe('Steve');
    expect(response[0].email).toBe('steve1@s1.com');
    expect(response[1].email).toBe('steve2@s1.com');
    done();
  });

  /* /<resource>?range=[0, 24] */
  test('GET_LIST respects range params', async (done) => {
    const fakeUsers = generateFakeUsers(11);
    await User.insertMany( fakeUsers );
    const _0_10 = await webApiRequest('GET',
      '/aor-api/users?range=[0, 10]'
    );
    // range should limit results
    expect(_0_10.length).toBe(10);

    // range should return appropriate results
    const [ _0_5, _5_10 ] = await Promise.all([
      webApiRequest('GET', '/aor-api/users?range=[0, 5]'),
      webApiRequest('GET', '/aor-api/users?range=[5, 10]'),
    ]);
    expect(_0_5).toEqual( _0_10.slice(0, 5) );
    expect(_5_10).toEqual( _0_10.slice(5, 10) );
    done();
  });

  test('GET_MANY gets a set of specified resources, given ids', async (done) => {
    const fakeUsers = generateFakeUsers(4);
    await User.insertMany( fakeUsers );
    const allUsers = await webApiRequest('GET',
      '/aor-api/users'
    );
    const firstTwoUserIds = allUsers
      .slice(0, 2)
      .map((user) => user._id );

    const apiIds = firstTwoUserIds.map((id) => `'${id}'`);

    const firstTwoUsers = await webApiRequest('GET',
      `/aor-api/users?filter={ids:[${apiIds.toString()}]}`
    );
    expect(firstTwoUsers.length).toBe(2);
    expect(firstTwoUsers[0]._id).toBe(firstTwoUserIds[0]);
    expect(firstTwoUsers[1]._id).toBe(firstTwoUserIds[1]);
    done();
  });

  test('GET_ONE gets a resource by id', async (done) => {
    let response = null;
    await User.insertMany( generateFakeUsers(4) );
    const allUsers = await webApiRequest('GET',
      '/aor-api/users'
    );
    response = await webApiRequest('GET',
      `/aor-api/users/${allUsers[0]._id}`
    );
    expect(response).toEqual( allUsers[0] );
    done();
  });

  test('CREATE makes a new resource', async (done) => {
    const testUserPayload = {
      first_name: 't1',
      email: 't1@test.com',
    };
    const response = await webApiRequest('POST',
      '/aor-api/users', {
        body: testUserPayload,
      }
    );
    expect(response).toMatchObject(testUserPayload);
    done();
  });

  test('UPDATE updates an existing resource', async (done) => {
    await User.insertMany( generateFakeUsers(1) );
    const allUsers = await webApiRequest('GET',
      '/aor-api/users'
    );
    const updates = {
      last_name: 'test_last',
    };
    const updatedUser = await webApiRequest('PUT',
      `/aor-api/users/${allUsers[0]._id}`, {
        body: updates,
      }
    );
    expect(updatedUser).toMatchObject(updates);
    done();
  });

  test('DELETE removes an existing resource', async (done) => {
    await User.insertMany( generateFakeUsers(2) );
    const allUsers = await webApiRequest('GET',
      '/aor-api/users'
    );
    const deletedUser = await webApiRequest('DELETE',
      `/aor-api/users/${allUsers[0]._id}`
    );
    expect(deletedUser).toEqual(allUsers[0]);
    done();
  });


});
