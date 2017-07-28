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
} from 'redux-modules/actions/user';

import {
  loadUserApi,
} from 'web-api/index';

function* loadUser({ [DEFERRED]: deferred }) {
  yield* apiFlow(
    loadUserApi,
    ACTION_LOAD_USER,
    { deferred },
  );
}

function* userSaga() {
  yield all([
    fork( createSagaWatcher(ACTION_LOAD_USER, loadUser) ),
  ]);
}

export default userSaga;
