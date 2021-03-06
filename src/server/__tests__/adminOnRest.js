import User from 'models/user';
import faker from 'faker';
import {
  setupTestEnvironment,
  teardownTestEnvironment,
} from './helpers/utils';

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
  let request = null;

  // Bootstrap application in test mode
  beforeAll(async (done) => {
    request = await setupTestEnvironment();
    done();
  });

  // Drop temp test database
  afterAll(async (done) => {
    teardownTestEnvironment();
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
    const { body: response } = await request('GET', '/aor-api/users');
    expect( response.length ).toBe(4);
    done();
  });

  /* /<resource>?sort=['title','ASC']&filter={title:'bar'} */
  test('GET_LIST respects sort and filter params', async (done) => {
    let response;
    const users =  [
      { first_name: 'Zed', email: 'zed@s1.com' },
      { first_name: 'Steve', email: 'steve2@s1.com' },
      { first_name: 'Steve', email: 'steve1@s1.com' },
      { first_name: 'Amy', email: 'amy@s1.com' },
    ];
    await User.insertMany( users );
    // sort param should work
    response = await request('GET',
      "/aor-api/users?sort=['first_name','ASC']"
    );
    expect(response.body[0].first_name).toBe('Amy');
    expect(response.body[response.body.length - 1].first_name).toBe('Zed');

    // filter params should work
    response = await request('GET',
      "/aor-api/users?filter={first_name:'Steve'}"
    );
    expect(response.body.length).toBe(2);
    expect(response.body[0].first_name).toBe('Steve');
    expect(response.body[1].first_name).toBe('Steve');

    // sort and filter params should work together
    response = await request('GET',
      "/aor-api/users?sort=['email','ASC']&filter={first_name:'Steve'}"
    );
    expect(response.body.length).toBe(2);
    expect(response.body[0].first_name).toBe('Steve');
    expect(response.body[1].first_name).toBe('Steve');
    expect(response.body[0].email).toBe('steve1@s1.com');
    expect(response.body[1].email).toBe('steve2@s1.com');
    done();
  });

  /* /<resource>?range=[0, 24] */
  test('GET_LIST respects range params', async (done) => {
    const fakeUsers = generateFakeUsers(11);
    await User.insertMany( fakeUsers );
    const { body: _0_10 }  = await request('GET',
      '/aor-api/users?range=[0, 10]'
    );
    // range should limit results
    expect(_0_10.length).toBe(10);

    // range should return appropriate results
    const [ _0_5_response, _5_10_response ] = await Promise.all([
      request('GET', '/aor-api/users?range=[0, 5]'),
      request('GET', '/aor-api/users?range=[5, 10]'),
    ]);
    expect(_0_5_response.body).toEqual( _0_10.slice(0, 5) );
    expect(_5_10_response.body).toEqual( _0_10.slice(5, 10) );
    done();
  });

  test('GET_MANY gets a set of specified resources, given ids', async (done) => {
    const fakeUsers = generateFakeUsers(4);
    await User.insertMany( fakeUsers );
    const { body: allUsers } = await request('GET',
      '/aor-api/users'
    );
    const firstTwoUserIds = allUsers
      .slice(0, 2)
      .map((user) => user._id );

    const apiIds = firstTwoUserIds.map((id) => `'${id}'`);

    const { body: firstTwoUsers } = await request('GET',
      `/aor-api/users?filter={ids:[${apiIds.toString()}]}`
    );
    expect(firstTwoUsers.length).toBe(2);
    expect(firstTwoUsers[0]._id).toBe(firstTwoUserIds[0]);
    expect(firstTwoUsers[1]._id).toBe(firstTwoUserIds[1]);
    done();
  });

  test('GET_ONE gets a resource by id', async (done) => {
    await User.insertMany( generateFakeUsers(4) );
    const { body: allUsers } = await request('GET',
      '/aor-api/users'
    );
    const { body: response } = await request('GET',
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
    const { body: response } = await request('POST',
      '/aor-api/users', {
        body: testUserPayload,
      }
    );
    expect(response).toMatchObject(testUserPayload);
    done();
  });

  test('UPDATE updates an existing resource', async (done) => {
    await User.insertMany( generateFakeUsers(1) );
    const { body: allUsers } = await request('GET',
      '/aor-api/users'
    );
    const updates = {
      last_name: 'test_last',
    };
    const { body: updatedUser } = await request('PUT',
      `/aor-api/users/${allUsers[0]._id}`, {
        body: updates,
      }
    );
    expect(updatedUser).toMatchObject(updates);
    done();
  });

  test('DELETE removes an existing resource', async (done) => {
    await User.insertMany( generateFakeUsers(2) );
    const { body: allUsers } = await request('GET',
      '/aor-api/users'
    );
    const { body: deletedUser } = await request('DELETE',
      `/aor-api/users/${allUsers[0]._id}`
    );
    expect(deletedUser).toEqual(allUsers[0]);
    done();
  });

});
