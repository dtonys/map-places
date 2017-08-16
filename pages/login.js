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


@clientEntry()
@attachRedux()
@connect()
class LoginPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  static async getInitialProps() {
    return { whatever: 'whatever' };
  }

  submitLogin = ( values ) => {
    alert( JSON.stringify( values, null, 2 ));

    this.props.dispatch( makeAction(
      request(ACTION_LOGIN),
      {
        email: values.email,
        password: values.password,
      }
    ) );
  }

  // componentWillReceiveProps() {
  // }

  // componentWillMount() {
  // }

  // componentDidMount() {
  // }

  render() {
    return (
      <div>
        <Layout htmlTitle={'Login'}>
          <div>
            <div style={{ marginTop: '50px' }} />
            <LoginForm onSubmit={ this.submitLogin } />
            {/*
            <LoginForm
              onSubmit={ this.submitLogin }
            />
            */}
          </div>
        </Layout>
      </div>
    );
  }
}

export default LoginPage;
