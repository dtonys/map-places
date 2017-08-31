import React, { Component } from 'react';
import {
  simpleRestClient,
  Admin,
  Resource,
  Delete,
  fetchUtils,
} from 'admin-on-rest';

import {
  UserList,
  UserEdit,
  UserCreate,
} from './users';

// import PlaceIcon from '../node-modules/material-ui/svg-icons/action/place';

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  // Pass this optoin into the `fetch` API to allow cookies to be sent to the server
  options.credentials = 'include';
  return fetchUtils.fetchJson(url, options);
};

class App extends Component {

  render() {
    return (
      <Admin
        restClient={simpleRestClient('http://localhost:8050/aor-api', httpClient )}
        title="MapPlaces Admin"
      >
        <Resource
          name="users"
          edit={UserEdit}
          create={UserCreate}
          remove={Delete}
          list={UserList}
        />
      </Admin>
    );
  }
}

export default App;
