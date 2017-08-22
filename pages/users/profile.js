import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';
import makeAction, {
  request,
} from 'helpers/reduxAction';
import {
  ACTION_LOAD_USER,
} from 'redux-modules/actions/user';

@clientEntry()
@attachRedux()
@connect(
  (globalState) => ({})
)
class UserProfilePage extends Component {
  static async getInitialProps( context ) {
    const { res } = context;
    // load user
    res.locals.reduxStore.dispatch( makeAction(
      request( ACTION_LOAD_USER ),
      null,
      { deferred: true }
    ) );
    // if logged in, fine
    // if not logged in, redirect to login?next=/users/profile
    return {};
  }

  render() {
    return (
      <div>{'UserProfilePage'}</div>
    );
  }
}

export default UserProfilePage;
