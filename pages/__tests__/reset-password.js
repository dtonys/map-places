import { getMockUrlProp } from './helpers/utils';
import { mount } from 'enzyme';
import ResetPasswordPage from '../reset-password';


describe('Reset password page', () => {

  let resetPasswordPage = null;
  beforeAll((done) => {
    resetPasswordPage = mount(<ResetPasswordPage url={getMockUrlProp('/reset-password')} />);
    done();
  });

  test('Should mount and render successfully', (done) => {
    expect(resetPasswordPage).toMatchSnapshot();
    done();
  });

  test('If passwords do not match, should show inline errors', (done) => {
    done();
  });

  test('If token is invalid, should display server error', (done) => {
    done();
  });

  test('On submit success, should show a success message with a login page prompt', (done) => {
    done();
  });

});
