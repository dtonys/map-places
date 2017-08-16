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
  ACTION_LOGIN,
  ACTION_SIGNUP,
} from 'redux-modules/actions/user';
import {
  loadUserApi,
  loginApi,
  signupApi,
} from 'web-api/index';


function* loadUser({ [DEFERRED]: deferred }) {
  yield* apiFlow(
    loadUserApi,
    ACTION_LOAD_USER,
    { deferred },
  );
}

function* login({
  [DEFERRED]: deferred,
  payload,
}) {
  const actionsTracker = yield* apiFlow(
    loginApi.bind( null, payload ),
    ACTION_LOGIN,
    { deferred },
  );
  if ( actionsTracker.successAction ) {
    alert( JSON.stringify( actionsTracker.successAction.payload, null, 2) );
    const successPayload = actionsTracker.successAction.payload;
    if ( successPayload.success === true ) {
      alert('redirect to home page');
      return;
    }
    alert('show user error');
  }
}

function* signup({
  [DEFERRED]: deferred,
  payload,
}) {
  const actionsTracker = yield* apiFlow(
    signupApi.bind( null, payload ),
    ACTION_SIGNUP,
    { deferred },
  );
  debugger;
}

function* userSaga() {
  yield all([
    fork( createSagaWatcher(ACTION_LOAD_USER, loadUser) ),
    fork( createSagaWatcher(ACTION_LOGIN, login) ),
    fork( createSagaWatcher(ACTION_SIGNUP, signup) ),
  ]);
}

export default userSaga;
