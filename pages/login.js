import { Component } from 'react';

import Layout from 'components/Layout';
import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';

import LoginForm from 'components/LoginForm';


@clientEntry()
@attachRedux()
class LoginPage extends Component {

  static async getInitialProps() {
    return { whatever: 'whatever' };
  }

  submitLogin = ( values ) => {
    console.log('login values');
    console.log(JSON.stringify(values));
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
