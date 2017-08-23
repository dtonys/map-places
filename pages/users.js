import { Component } from 'react';

import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';
import authenticatedPage from  'helpers/authenticatedPage';

import Layout from 'components/Layout';


@clientEntry()
@attachRedux()
@authenticatedPage()
class UserPage extends Component {
  static async getInitialProps() {
    return {};
  }

  render() {
    return (
      <div>
        <Layout htmlTitle={'Users'}>
          <div>
            { JSON.stringify(this.props.url) }
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

export default UserPage;
