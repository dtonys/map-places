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
} from 'redux-modules/actions/user';
import SignupForm from 'components/SignupForm';

@clientEntry()
@attachRedux()
@connect()
class SignupPage extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  submitSignup = ( values ) => {
    alert( JSON.stringify( values, null, 2 ));

    this.props.dispatch( makeAction(
      request(ACTION_SIGNUP),
      {
        email: values.email,
        password: values.password,
      }
    ) );
  }

  render() {
    return (
      <div>
        <Layout htmlTitle={'Signup'}>
          <div>
            <div style={{ marginTop: '50px' }} />
            <SignupForm onSubmit={ this.submitSignup } />
          </div>
        </Layout>
      </div>
    );
  }
}

export default SignupPage;
