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
} from './resources/users';
import {
  PlaceList,
  PlaceEdit,
  PlaceCreate,
} from './resources/places';
import PersonIcon from 'material-ui/svg-icons/social/person';
import PlaceIcon from 'material-ui/svg-icons/maps/place';
// import SessionIcon from 'material-ui/svg-icons/action/compare-arrows';

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  // Pass this option into the `fetch` API to allow cookies to be sent to the server
  options.credentials = 'include';
  console.log(`${options.method || ''} ${url}`);
  if ( options.body ) {
    console.log(`${options.body}`);
  }
  return fetchUtils.fetchJson(url, options);
};

class App extends Component {

  render() {
    return (
      <Admin
        restClient={simpleRestClient(`${process.env.REACT_APP_ADMIN_API_PATH}/aor-api`, httpClient )}
        title="MapPlaces Admin"
      >
        <Resource
          name="users"
          icon={PersonIcon}
          list={UserList}
          create={UserCreate}
          edit={UserEdit}
          remove={Delete}
        />
        <Resource
          name="places"
          icon={PlaceIcon}
          list={PlaceList}
          create={PlaceCreate}
          edit={PlaceEdit}
          remove={Delete}
        />
      </Admin>
    );
  }
}

export default App;
