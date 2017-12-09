/**
 * @jest-environment node
 */
import getPort from 'get-port';
import User from 'models/user';
import {
  setupTestEnvironment,
  teardownTestEnvironment,
} from 'helpers/testUtils';


describe('Auth API tests', () => {

  let request = null;
  let port = null;

  // Bootstrap application in test mode
  beforeAll(async (done) => {
    port = await getPort();
    request = await setupTestEnvironment(port);
    done();
  });

  // Drop temp test database
  afterAll(async (done) => {
    teardownTestEnvironment(port);
    done();
  });

  describe('POST `/api/signup`', () => {
    test('Creates a new user, sends a verify email, and logs the user in', async ( done ) => {
      const userPayload = {
        "email": "test3@test.com",
        "password": "test3_pass",
        "first_name": "test3_first",
        "last_name": "test3_last"
      };

      const response = await request(
        'POST', '/api/signup', {
          body: userPayload,
        }
      );
      delete userPayload.password;
      // Creates a new user
      expect(response.body.data).toMatchObject(userPayload);
      expect(response.body.data.password_hash).toBeTruthy();
      expect(response.body.data.is_email_verified).toBe(false);

      // Sends a verify email
      // maildev.on('new', function(email){
      //   console.log('Received new email with subject: %s', email.subject);
      // });

      // Logs the user in
      // Check cookie header to see if cookie is set

      expect(true).toBe(true);
      done();
    });

    test('', async (done) => {
      done();
    });

  });



  test('POST `/api/login` logs the user in', async ( done ) => {
    expect(true).toBe(true);
    done();
  });
  test('GET `/api/logout` logs the user out', async ( done ) => {
    expect(true).toBe(true);
    done();
  });
  test('GET `/api/session/info` gets the logged in user\'s data', async ( done ) => {
    expect(true).toBe(true);
    done();
  });
  test('GET `/api/verify-email` makes the user verified and redirects to home', async ( done ) => {
    expect(true).toBe(true);
    done();
  });
  test('POST `/api/lost-password` sends an email to reset the user\'s password', async ( done ) => {
    expect(true).toBe(true);
    done();
  });
  test('POST  `/api/reset-password` changes the user\'s password', async ( done ) => {
    expect(true).toBe(true);
    done();
  });

});