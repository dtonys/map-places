import {
  fork,
  all,
  call,
  put,
} from 'redux-saga/effects';
import {
  apiFlow,
  createSagaWatcher,
} from 'helpers/sagaHelpers';
import makeAction, {
  apiStart,
  apiSuccess,
  apiError,
} from 'helpers/reduxAction';

import {
  ACTION_LOAD_USER,
  ACTION_LOGIN,
  ACTION_LOGOUT,
  ACTION_RESET_PASSWORD,
  ACTION_LOST_PASSWORD,
} from 'redux-modules/actions/user';
import {
  sessionInfoApi,
  loginApi,
  logoutApi,
  lostPasswordApi,
  resetPasswordApi,
} from 'web-api/index';
import { Router } from 'routes/pageRoutes';


export function* loadUser( action, webApiRequest ) {
  yield put( makeAction( apiStart(ACTION_LOAD_USER) ) );
  try {
    const responseData = yield call( sessionInfoApi, webApiRequest );
    if ( responseData && responseData.currentUser ) {
      yield put( makeAction( apiSuccess(ACTION_LOAD_USER), responseData.currentUser ) );
      if ( action.deferred ) {
        action.deferred.resolve(responseData.currentUser);
      }
    }
    else {
      yield put( makeAction( apiSuccess(ACTION_LOAD_USER), null ) );
      if ( action.deferred ) {
        action.deferred.resolve(null);
      }
    }
  }
  catch ( error ) {
    makeAction( apiError(ACTION_LOAD_USER) );
  }
}

function* login( action, webApiRequest ) {
  const actionsTracker = yield* apiFlow(
    loginApi.bind( null, webApiRequest, action.payload ),
    ACTION_LOGIN,
    { deferred: action.deferred }
  );
  if ( actionsTracker.successAction ) {
    yield* loadUser(action, webApiRequest);
    Router.pushRoute( action.payload.nextPath || '/');
  }
}

function* logout( action, webApiRequest ) {
  const actionsTracker = yield* apiFlow(
    logoutApi.bind( null, webApiRequest ),
    ACTION_LOGOUT,
    { deferred: action.deferred }
  );
  if ( actionsTracker.successAction ) {
    yield* loadUser(action, webApiRequest);
    Router.pushRoute('/');
  }
}

function* resetPassword( action, webApiRequest ) {
  yield* apiFlow(
    resetPasswordApi.bind( null, webApiRequest, action.payload ),
    ACTION_RESET_PASSWORD,
    { deferred: action.deferred }
  );
}

function* lostPassword( action, webApiRequest ) {
  yield* apiFlow(
    lostPasswordApi.bind( null, webApiRequest, action.payload ),
    ACTION_LOST_PASSWORD,
    { deferred: action.deferred }
  );
}


function* userSaga( webApiRequest ) {
  yield all([
    fork( createSagaWatcher(ACTION_LOAD_USER, loadUser, webApiRequest) ),
    fork( createSagaWatcher(ACTION_LOGIN, login, webApiRequest) ),
    fork( createSagaWatcher(ACTION_LOGOUT, logout, webApiRequest) ),
    fork( createSagaWatcher(ACTION_RESET_PASSWORD, resetPassword, webApiRequest) ),
    fork( createSagaWatcher(ACTION_LOST_PASSWORD, lostPassword, webApiRequest) ),
  ]);
}

export default userSaga;
