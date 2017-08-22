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
  ACTION_LOGIN,
} from 'redux-modules/actions/user';
import LoginForm from 'components/LoginForm';
import {
  extractLoginErrorMessage,
} from 'redux-modules/reducers/user';


@clientEntry()
@attachRedux()
@connect(
  (globalState) => ({
    loginErrorMessage: extractLoginErrorMessage(globalState),
  })
)
class LoginPage extends Component {
  static propTypes = {
    loginErrorMessage: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  }

  static async getInitialProps() {
    return { whatever: 'whatever' };
  }

  submitLogin = ( values ) => {
    this.props.dispatch( makeAction(
      request(ACTION_LOGIN),
      {
        email: values.email,
        password: values.password,
      },
    ) );
  }

  // componentWillReceiveProps() {
  // }

  // componentWillMount() {
  // }

  // componentDidMount() {
  // }

  render() {
    const {
      loginErrorMessage,
    } = this.props;

    return (
      <div>
        <Layout htmlTitle={'Login'}>
          <div>
            <div style={{ marginTop: '50px' }} />
            <LoginForm
              onSubmit={ this.submitLogin }
              serverErrorMessage={loginErrorMessage}
            />
          </div>
        </Layout>
      </div>
    );
  }
}

export default LoginPage;
