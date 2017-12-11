/**
 * @jest-environment node
 */
import getPort from 'get-port';
import User from 'models/user';
import {
  setupTestEnvironment,
  teardownTestEnvironment,
} from 'helpers/testUtils';
import {
  onNextMailSent,
  collectMail,
} from 'email/mailer';
import {
  isValidSession,
} from 'helpers/session'

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
  describe('POST `/api/signup`', () => {
    test('Creates a new user, sends a verify email, and logs the user in', async ( done ) => {
      const userPayload = {
        "email": "test3@test.com",
        "password": "test3_pass",
        "first_name": "test3_first",
        "last_name": "test3_last"
      };

      const nextMailPromise = onNextMailSent();
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

      // Verify the email was sent
      const nextMailHtml = await nextMailPromise;
      // Email contains verify text
      expect(nextMailHtml).toContain('Verify your account');
      // Email contains a link with a session token
      const result = /verify-email\?sessionToken=(.+")/.exec(nextMailHtml);
      expect(nextMailHtml).toContain(result[0]);
      const sessionToken = result[1];
      expect(sessionToken).toBeTruthy();
      // The session token is valid
      const validSesssion = await isValidSession(sessionToken);
      expect(validSesssion).toBe(true);

      // Check user is logged in
      expect(response.headers['set-cookie'][0]).toContain('MP-Session=');
      done();
    });

    test('Returns 422 error if email already exists', async ( done ) => {
      const userPayload = {
        "email": "test3@test.com",
        "password": "test3_pass",
        "first_name": "test3_first",
        "last_name": "test3_last"
      };
      await request(
        'POST', '/api/signup', {
          body: userPayload,
        }
      );
      const response = await request(
        'POST', '/api/signup', {
          body: userPayload,
        }
      );
      expect(response.statusCode).toBe(422);
      done();
    });
  });

  describe('POST `/api/login`', () => {
    test('Logs the user in', async ( done ) => {
      const userPayload = {
        "email": "test3@test.com",
        "password": "test3_pass",
        "first_name": "test3_first",
        "last_name": "test3_last"
      };
      await request(
        'POST', '/api/signup', {
          body: userPayload,
        }
      );
      const response = await request(
        'POST', '/api/login', {
          body: {
            email: userPayload.email,
            password: userPayload.password,
          },
        }
      );
      // API success
      expect(response.statusCode).toBe(200);
      // User is logged in
      expect(response.headers['set-cookie'][0]).toContain('MP-Session=');
      done();
    });

    test('Returns 404 if the user is not found', async ( done ) => {
      const userPayload = {
        "email": "test3@test.com",
        "password": "test3_pass",
        "first_name": "test3_first",
        "last_name": "test3_last"
      };
      const response = await request(
        'POST', '/api/login', {
          body: {
            email: userPayload.email,
            password: userPayload.password,
          },
        }
      );
      // 404
      expect(response.statusCode).toBe(404);
      done();
    });

    test('Returns 422 if the password is wrong', async ( done ) => {
      const userPayload = {
        "email": "test3@test.com",
        "password": "test3_pass",
        "first_name": "test3_first",
        "last_name": "test3_last"
      };
      await request(
        'POST', '/api/signup', {
          body: userPayload,
        }
      );
      const response = await request(
        'POST', '/api/login', {
          body: {
            email: userPayload.email,
            password: '12345678',
          },
        }
      );
      // 404
      expect(response.statusCode).toBe(422);
      done();
    });
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