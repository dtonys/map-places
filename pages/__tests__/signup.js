jest.mock('superagent', () => ( require('../../jest-config/__mocks__/superagent') ));
import { getMockUrlProp } from './helpers/utils';
import { mount } from 'enzyme';
import SignupPage from '../signup';


describe('Signup page', () => {

  let superagent = null;
  let signupPage = null;
  beforeAll((done) => {
    superagent = require('superagent');
    superagent.__setMockDelay(1);
    signupPage = mount(<SignupPage url={getMockUrlProp('/signup')} />);
    done();
  });

  test('Should mount and render successfully', (done) => {
    expect(signupPage).toMatchSnapshot();
    done();
  });

  test('Should display navbar and a signup form', () => {
    expect(signupPage.find('Navbar').exists()).toBe(true);
    expect(signupPage.find('SignupFormView').exists()).toBe(true);
  });

  test('On signup submit error, should show an error in the signup form', (done) => {
    const signupErrorResponse = {
      error: [
        { message: 'User email already in use' },
      ],
    };
    superagent.__setMockResponse({
      status: 422,
      text: JSON.stringify(signupErrorResponse),
    });
    signupPage.find('[data-test="email"]')
      .simulate('change', { target: { value: 'abcdefg@gmail.com' } });
    signupPage.find('[data-test="password"]')
      .simulate('change', { target: { value: '12345678' } });
    signupPage.find('[data-test="submit"]').getDOMNode().click();
    setTimeout(() => {
      signupPage.update();
      expect(signupPage.find('[data-test="serverError"]'))
        .toIncludeText('User email already in use');
      done();
    }, 100);
  });
});
