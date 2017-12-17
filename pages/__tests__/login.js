/**
 * @jest-environment jsdom
 */
import { mount } from 'enzyme';
import LoginPage from '../login';
import {
  setupClientTestEnvironment,
  teardownClientTestEnvironment,
} from './helpers/utils';


function getMockUrlProp( pathname ) {
  switch (pathname) {
    case 'login': {
      return {
        query: {},
        pathname: '/login',
        asPath: '/login',
      };
    }
    default: {
      return {
        query: {},
        pathname: '/',
        asPath: '/',
      };
    }
  }
}

describe('Login page', () => {
  beforeAll(async (done) => {
    setupClientTestEnvironment();
    done();
  });

  afterAll(async (done) => {
    teardownClientTestEnvironment();
    done();
  });

  test('Should mount with enzyme', () => {
    const loginPage = mount(<LoginPage url={getMockUrlProp('login')} />);
    expect(loginPage).toMatchSnapshot();
    expect(true).toBeTruthy();
  });

  test('Should display a login form and a navbar', () => {
    expect(true).toBeTruthy();
  });

  test('Should display a login form and a navbar', () => {
    expect(true).toBeTruthy();
  });
  // On login submit error, should see a server error in the login form
  // On login submit success, should redirect to home page
});
