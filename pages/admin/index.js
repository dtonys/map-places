import { Component } from 'react';
import clientOnly from 'helpers/clientOnly';

import {
  jsonServerRestClient,
  Admin,
  Resource,
} from 'admin-on-rest';

import {
  PostList,
  PostEdit,
  PostCreate,
  PostIcon,
} from 'components/admin-on-rest/posts';


// NOTE: `admin-on-rest` breaks on server side render
@clientOnly
class AdminIndex extends Component {
  render() {
    return (
      <Admin restClient={jsonServerRestClient('http://jsonplaceholder.typicode.com')}>
        <Resource
          name="posts"
          list={PostList}
          edit={PostEdit}
          create={PostCreate}
          icon={PostIcon}
        />
      </Admin>
    );
  }

}

export default AdminIndex;
