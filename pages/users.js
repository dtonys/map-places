import { Component } from 'react';

import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';
import Layout from 'components/Layout';

@clientEntry()
@attachRedux()
class UserPage extends Component {
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
