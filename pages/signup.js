import { Component } from 'react';

import Layout from 'components/Layout';
import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';

import SignupForm from 'components/SignupForm';

@clientEntry()
@attachRedux()
class SignupPage extends Component {

  submitSignup = ( values ) => {
    console.log('signup values');
    console.log(JSON.stringify(values));
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
