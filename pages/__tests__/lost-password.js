jest.mock('superagent', () => ( require('../../jest-config/__mocks__/superagent') ));
import { getMockUrlProp } from './helpers/utils';
import { mount } from 'enzyme';
import LostPasswordPage from '../lost-password';


describe('Lost password page', () => {

  let superagent = null;
  let lostPasswordPage = null;
  beforeAll((done) => {
    superagent = require('superagent');
    superagent.__setMockDelay(1);
    lostPasswordPage = mount(<LostPasswordPage url={getMockUrlProp('/lost-password')} />);
    done();
  });

  test('Should mount and render successfully', (done) => {
    expect(lostPasswordPage).toMatchSnapshot();
    done();
  });

  test('On submit error, should show error message', (done) => {
    const errorResponse = {
      error: [
        { message: 'Email not found' },
      ],
    };
    superagent.__setMockResponse({
      status: 404,
      text: JSON.stringify(errorResponse),
    });
    lostPasswordPage.find('[data-test="email"]')
      .simulate('change', { target: { value: 'abcdefg@gmail.com' } });
    lostPasswordPage.find('[data-test="submit"]').getDOMNode().click();
    setTimeout(() => {
      expect(lostPasswordPage.find('form')).toIncludeText('Email not found');
      done();
    }, 100);
  });

  test('On submit success, should show a success screen', (done) => {
    const successResponse = {
      data: null,
    };
    superagent.__setMockResponse({
      status: 200,
      text: JSON.stringify(successResponse),
    });
    lostPasswordPage.find('[data-test="email"]')
      .simulate('change', { target: { value: 'abcdefg@gmail.com' } });
    lostPasswordPage.find('[data-test="submit"]').getDOMNode().click();
    setTimeout(() => {
      expect(lostPasswordPage.find('form'))
        .toIncludeText('Check your email to reset your password.');
      done();
    }, 100);
    done();
  });

});
