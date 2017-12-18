jest.mock('superagent', () => ( require('../../jest-config/__mocks__/superagent') ));
import { mount } from 'enzyme';
import LoginPage from '../login';


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

  let superagent = null;
  let loginPage = null;
  beforeAll((done) => {
    superagent = require('superagent');
    superagent.__setMockDelay(1);
    loginPage = mount(<LoginPage url={getMockUrlProp('login')} />);
    done();
  });

  test('Should mount and render successfully', () => {
    expect(loginPage).toMatchSnapshot();
    expect(true).toBeTruthy();
  });

  test('Should display navbar and a login form', () => {
    expect(loginPage.find('Navbar').exists()).toBe(true);
    expect(loginPage.find('LoginFormView').exists()).toBe(true);
    expect(true).toBeTruthy();
  });

  // On login submit error, should see a server error in the login form
  test('On login submit error, should see a server error in the login form', (done) => {
    const emailNotFoundError = 'Email not found';
    const emailNotFoundPayload = {
      error: [
        { message: emailNotFoundError },
      ],
    };
    superagent.__setMockResponse({
      status: 404,
      text: JSON.stringify(emailNotFoundPayload),
    });
    loginPage.find('[data-test="email"]')
      .simulate('change', { target: { value: 'abcdefg@gmail.com' } });
    loginPage.find('[data-test="password"]')
      .simulate('change', { target: { value: '12345678' } });
    loginPage.find('[data-test="submit"]').getDOMNode().click();
    setTimeout(() => {
      expect(loginPage.find('form')).toIncludeText(emailNotFoundError);
      done();
    }, 100);
  });
});
