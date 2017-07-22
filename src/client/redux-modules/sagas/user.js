import {
  fork,
  all,
} from 'redux-saga/effects';
import {
  startSuccessErrorFlow,
  createSagaWatcher,
} from 'helpers/sagaHelpers';

import {
  ACTION_LOAD_USER,
  ACTION_LOAD_PAGE,
} from 'redux-modules/actions/user';

import {
  loadUserApi,
  loadPageDataApi,
} from 'web-api/index';

function* loadPage() {
  yield* startSuccessErrorFlow(
    loadPageDataApi,
    ACTION_LOAD_PAGE,
  );
}

function* loadUser() {
  yield* startSuccessErrorFlow(
    loadUserApi,
    ACTION_LOAD_USER,
  );
}


function* userSaga() {
  yield all([
    fork( createSagaWatcher(ACTION_LOAD_USER, loadUser) ),
    fork( createSagaWatcher(ACTION_LOAD_PAGE, loadPage) ),
  ]);
}

export default userSaga;
