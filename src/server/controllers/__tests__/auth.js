/**
 * @jest-environment node
 */

import cookie from 'cookie';
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
} from 'helpers/session';

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
        email: 'test1@test.com',
        password: 'test1_pass',
        first_name: 'test1_first',
        last_name: 'test1_last',
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
      const [ emailLink, sessionToken ] = /verify-email\?sessionToken=([^"]+)/.exec(nextMailHtml);
      expect(nextMailHtml).toContain(emailLink);
      expect(sessionToken).toBeTruthy();
      // The session token is valid
      const validSession = await isValidSession(decodeURIComponent(sessionToken));
      expect(validSession).toBe(true);

      // Check user is logged in
      expect(response.headers['set-cookie'][0]).toContain('MP-Session=');
      done();
    });

    test('Returns 422 error if email already exists', async ( done ) => {
      const userPayload = {
        email: 'test2@test.com',
        password: 'test2_pass',
        first_name: 'test2_first',
        last_name: 'test2_last',
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
        email: 'test3@test.com',
        password: 'test3_pass',
        first_name: 'test3_first',
        last_name: 'test3_last',
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
        email: 'test4@test.com',
        password: 'test4_pass',
        first_name: 'test4_first',
        last_name: 'test4_last',
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
        email: 'test5@test.com',
        password: 'test5_pass',
        first_name: 'test5_first',
        last_name: 'test5_last',
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
    const userPayload = {
      email: 'test6@test.com',
      password: 'test6_pass',
      first_name: 'test6_first',
      last_name: 'test6_last',
    };
    const signupResponse = await request(
      'POST', '/api/signup', {
        body: userPayload,
      }
    );
    const [ , sessionToken ] = /MP-Session=([^;]+)/.exec(signupResponse.headers['set-cookie'][0]);
    expect(true).toBe(true);
    const response = await request(
      'GET', '/api/logout', {
        headers: {
          Cookie: `MP-Session=${sessionToken}`,
        },
      },
    );
    const cookieObj = cookie.parse(response.headers['set-cookie'][0]);
    // check to see the session cookie is cleared
    expect(cookieObj['MP-Session']).toBeDefined();
    const expireDate = new Date(cookieObj.Expires).getTime();
    const now = (new Date()).getTime();
    expect(expireDate).toBeLessThan(now);
    done();
  });

  test('GET `/api/session/info` gets the logged in user\'s data', async ( done ) => {
    const userPayload = {
      email: 'test7@test.com',
      password: 'test7_pass',
      first_name: 'test7_first',
      last_name: 'test7_last',
    };
    const signupResponse = await request(
      'POST', '/api/signup', {
        body: userPayload,
      }
    );
    const [ , sessionToken ] = /MP-Session=([^;]+)/.exec(signupResponse.headers['set-cookie'][0]);
    const response = await request(
      'GET', '/api/session/info', {
        headers: {
          Cookie: `MP-Session=${sessionToken}`,
        },
      },
    );
    expect(response.body.data.currentUser).toBeTruthy();
    delete userPayload.password;
    expect(response.body.data.currentUser).toMatchObject(userPayload);
    done();
  });

  test('GET `/api/verify-email` makes the user verified and redirects to home', async ( done ) => {
    const userPayload = {
      email: 'test8@test.com',
      password: 'test8_pass',
      first_name: 'test8_first',
      last_name: 'test8_last',
    };
    const nextMailPromise = onNextMailSent();
    const signupResponse = await request(
      'POST', '/api/signup', {
        body: userPayload,
      },
    );
    const [ , sessionToken ] = /MP-Session=([^;]+)/.exec(signupResponse.headers['set-cookie'][0]);
    const nextMailHtml = await nextMailPromise;
    const [ , emailToken ] = /\/api\/verify-email\?sessionToken=([^"]+)/.exec(nextMailHtml);
    const validSessionToken = await isValidSession(decodeURIComponent(sessionToken));
    expect(validSessionToken).toBe(true);
    const verifyResponse = await request(
      'GET', '/api/verify-email', {
        query: {
          sessionToken: emailToken,
        },
      },
    );
    // Makes the user verified
    const queriedUser = await User.findOne({ email: userPayload.email });
    expect(queriedUser.is_email_verified).toBe(true);
    // Redirects to home page
    expect(verifyResponse.statusCode).toBe(302);
    expect(verifyResponse.headers.location).toBe('/');

    // User is logged in
    expect(verifyResponse.headers['set-cookie'][0]).toContain('MP-Session=');
    done();
  });

  test('POST `/api/lost-password` sends an email to reset the user\'s password', async ( done ) => {
    const userPayload = {
      email: 'test8@test.com',
      password: 'test8_pass',
      first_name: 'test8_first',
      last_name: 'test8_last',
    };
    const getMail = collectMail();
    await request(
      'POST', '/api/signup', {
        body: userPayload,
      },
    );
    await request(
      'POST', '/api/lost-password', {
        body: {
          email: userPayload.email,
        },
      },
    );
    const mailList = getMail();
    const lastMail = mailList[mailList.length - 1];
    const [ emailLink ] = /reset-password\?sessionToken=([^"]+)/.exec(lastMail);
    expect(lastMail).toContain(emailLink);
    expect(lastMail).toContain('reset your password');
    expect(lastMail).toContain(userPayload.first_name);
    done();
  });

  test('POST  `/api/reset-password` changes the user\'s password', async ( done ) => {
    const userPayload = {
      email: 'test8@test.com',
      password: 'test8_pass',
      first_name: 'test8_first',
      last_name: 'test8_last',
    };
    const newPassword = 'new_pass';
    const getMail = collectMail();
    await request(
      'POST', '/api/signup', {
        body: userPayload,
      },
    );
    await request(
      'POST', '/api/lost-password', {
        body: {
          email: userPayload.email,
        },
      },
    );
    const mailList = getMail();
    const lastMail = mailList[mailList.length - 1];
    const [ /* emailLink */, emailToken ] = /reset-password\?sessionToken=([^"]+)/.exec(lastMail);

    const resetPasswordResponse = await request(
      'POST', '/api/reset-password', {
        body: {
          password: newPassword,
          passwordConfirm: newPassword,
          sessionToken: emailToken,
        },
      },
    );
    expect(resetPasswordResponse.statusCode).toBe(200);

    // User can log in with the new password
    const loginResponse = await request(
      'POST', '/api/login', {
        body: {
          email: userPayload.email,
          password: newPassword,
        },
      }
    );
    expect(loginResponse.statusCode).toBe(200);
    done();
  });
});
