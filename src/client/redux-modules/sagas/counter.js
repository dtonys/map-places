import {
  put,
  fork,
  all,
} from 'redux-saga/effects';

import {
  apiFlow,
  createSagaWatcher,
} from 'helpers/sagaHelpers';

import {
  ACTION_INCREMENT_COUNTER_ASYNC,
  ACTION_INCREMENT_COUNTER,
} from 'redux-modules/actions/counter';

import makeAction, {
  execute,
} from 'helpers/reduxAction';

function mockAPIWithDelay( delayMs, error ) {
  return new Promise(( resolve, reject ) => {
    setTimeout(() => {
      if ( error ) {
        reject({ success: false });
        return;
      }
      resolve({ success: true });
    }, delayMs);
  });
}

function* runIncrementAsync(
  { delayMs },
  // webApiRequest,
) {
  const flowActions = yield* apiFlow(
    mockAPIWithDelay.bind( null, delayMs, false ),
    ACTION_INCREMENT_COUNTER_ASYNC,
  );

  if ( flowActions.successAction ) {
    yield put( makeAction(
      execute(ACTION_INCREMENT_COUNTER)
    ) );
  }
}

function* counterSaga(webApiRequest) {
  yield all([
    fork( createSagaWatcher(ACTION_INCREMENT_COUNTER_ASYNC, runIncrementAsync, webApiRequest) ),
  ]);
}

export default counterSaga;
