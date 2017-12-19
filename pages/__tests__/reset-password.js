jest.mock('superagent', () => ( require('../../jest-config/__mocks__/superagent') ));
import { getMockUrlProp } from './helpers/utils';
import { mount } from 'enzyme';
import ResetPasswordPage from '../reset-password';


describe('Reset password page', () => {

  let superagent = null;
  let resetPasswordPage = null;
  beforeAll((done) => {
    superagent = require('superagent');
    superagent.__setMockDelay(1);
    resetPasswordPage = mount(<ResetPasswordPage url={getMockUrlProp('/reset-password')} />);
    done();
  });

  test('Should mount and render successfully', (done) => {
    expect(resetPasswordPage).toMatchSnapshot();
    done();
  });

  test('If token is invalid, should display server error', (done) => {
    const invalidSessionError = {
      error: [ {
        message: 'Invalid or expired session.',
      } ],
    };
    superagent.__setMockResponse({
      status: 422,
      text: JSON.stringify(invalidSessionError),
    });
    resetPasswordPage.find('[data-test="password"]')
      .simulate('change', { target: { value: 'abcdefg' } });
    resetPasswordPage.find('[data-test="passwordConfirm"]')
      .simulate('change', { target: { value: 'abcdefg' } });
    resetPasswordPage.find('[data-test="submit"]').getDOMNode().click();
    setTimeout(() => {
      resetPasswordPage.update();
      expect(resetPasswordPage.find('[data-test="serverError"]'))
        .toIncludeText('Invalid or expired session.');
      done();
    }, 100);
  });

  test('On submit success, should show a success message', (done) => {
    const successResponse = {
      data: null,
    };
    superagent.__setMockResponse({
      status: 200,
      text: JSON.stringify(successResponse),
    });
    resetPasswordPage.find('[data-test="password"]')
      .simulate('change', { target: { value: 'abcdefg' } });
    resetPasswordPage.find('[data-test="passwordConfirm"]')
      .simulate('change', { target: { value: 'abcdefg' } });
    resetPasswordPage.find('[data-test="submit"]').getDOMNode().click();
    setTimeout(() => {
      resetPasswordPage.update();
      expect(resetPasswordPage.find('[data-test="successWrap"]'))
        .toIncludeText('Your password was changed successfully');
      done();
    }, 100);
  });

});
