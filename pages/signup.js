import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Layout from 'components/Layout';
import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';
import makeAction, {
  request,
} from 'helpers/reduxAction';
import {
  ACTION_SIGNUP,
} from 'redux-modules/actions/signup';
import {
  extractSignupErrorMessage,
} from 'redux-modules/reducers/signup';

import SignupForm from 'components/SignupForm';


@clientEntry()
@attachRedux()
@connect(
  (globalState) => ({
    signupErrorMessage: extractSignupErrorMessage(globalState),
  })
)
class SignupPage extends Component {

  static propTypes = {
    signupErrorMessage: PropTypes.string,
    url: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  submitSignup = ( values ) => {
    const nextPath = this.props.url.query.next;
    this.props.dispatch( makeAction(
      request(ACTION_SIGNUP),
      {
        email: values.email,
        password: values.password,
        nextPath: nextPath,
      }
    ) );
  }

  render() {
    const {
      signupErrorMessage,
    } = this.props;

    return (
      <div>
        <Layout htmlTitle={'Signup'}>
          <div>
            <div style={{ marginTop: '50px' }} />
            <SignupForm
              onSubmit={ this.submitSignup }
              serverErrorMessage={signupErrorMessage}
            />
          </div>
        </Layout>
      </div>
    );
  }
}

export default SignupPage;
