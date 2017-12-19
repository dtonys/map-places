import { getMockUrlProp } from './helpers/utils';
import { mount } from 'enzyme';
import SignupPage from '../signup';


describe('Signup page', () => {

  let signupPage = null;
  beforeAll((done) => {
    signupPage = mount(<SignupPage url={getMockUrlProp('/signup')} />);
    done();
  });

  test('Should mount and render successfully', (done) => {
    expect(signupPage).toMatchSnapshot();
    done();
  });

  // test('Should display navbar and a login form', () => {
  //   expect(loginPage.find('Navbar').exists()).toBe(true);
  //   expect(loginPage.find('LoginFormView').exists()).toBe(true);
  // });
});
