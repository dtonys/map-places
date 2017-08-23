import {
  all,
  fork,
} from 'redux-saga/effects';
import {
  apiFlow,
  createSagaWatcher,
} from 'helpers/sagaHelpers';

import {
  ACTION_SIGNUP,
} from 'redux-modules/actions/signup';
import {
  signupApi,
} from 'web-api/index';
import {
  loadUser,
} from 'redux-modules/sagas/user';
import { Router } from 'routes/pageRoutes';


function* signup( action, webApiRequest ) {
  const actionsTracker = yield* apiFlow(
    signupApi.bind( null, webApiRequest, action.payload ),
    ACTION_SIGNUP,
    { deferred: action.deferred }
  );
  if ( actionsTracker.successAction ) {
    yield* loadUser(action, webApiRequest);
    Router.pushRoute( action.payload.nextPath || '/');
  }
}

function* signupSaga( webApiRequest ) {
  yield all([
    fork( createSagaWatcher(ACTION_SIGNUP, signup, webApiRequest) ),
  ]);
}

export default signupSaga;
