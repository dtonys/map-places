import {
  fork,
  all,
  // take,
} from 'redux-saga/effects';
import {
  apiFlow,
  createSagaWatcher,
} from 'helpers/sagaHelpers';
// import {
//   request,
// } from 'helpers/reduxAction';
import {
  DEFERRED,
} from 'redux-modules/middleware/sagaPromiseMiddlware';

import {
  ACTION_LOAD_USER,
  ACTION_LOAD_PAGE,
} from 'redux-modules/actions/user';

import {
  loadUserApi,
  loadPageDataApi,
} from 'web-api/index';

function* loadPage() {
  yield* apiFlow(
    loadPageDataApi,
    ACTION_LOAD_PAGE,
  );
}

function* loadUser({ [DEFERRED]: deferred }) {
  yield* apiFlow(
    loadUserApi,
    ACTION_LOAD_USER,
    deferred,
  );
}

// function* watchLoadUser() {
//   while ( true ) { // eslint-disable-line no-constant-condition
//     const action =  yield take( request( ACTION_LOAD_USER ) );
//     yield* loadUser( action );
//   }
// }


function* userSaga() {
  yield all([
    fork( createSagaWatcher(ACTION_LOAD_USER, loadUser) ),
    fork( createSagaWatcher(ACTION_LOAD_PAGE, loadPage) ),
  ]);
}

export default userSaga;
