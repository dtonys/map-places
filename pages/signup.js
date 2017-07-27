import { Component } from 'react';

import Layout from 'components/Layout';
import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';

const mockSubmit = (event) => { event.preventDefault(); };

@clientEntry()
@attachRedux()
class SignupPage extends Component {
  render() {
    return (
      <div>
        <Layout htmlTitle={'Signup'}>
          <div>
            <div style={{ marginTop: '50px' }} />
            <div className="formWrap">
              <form method="post" action="" className="form signupForm" onSubmit={mockSubmit} >
                <h3> Signup </h3>
                <fieldset>
                  <div className="form-item">
                    <label>Email</label>
                    <input type="email" name="user-email" />
                  </div>
                  <div className="form-item">
                    <label>Password</label>
                    <input type="password" name="user-password" />
                  </div>
                  <div className="form-item">
                    <button className="w50" >Submit</button>
                  </div>
                </fieldset>
              </form>
            </div>
            <style jsx>{`
              .signupForm {
                max-width: 600px;
                margin: auto;
              }
              .formWrap {
                padding: 0 10px;
              }
            `}</style>
          </div>
        </Layout>
      </div>
    );
  }
}

export default SignupPage;
