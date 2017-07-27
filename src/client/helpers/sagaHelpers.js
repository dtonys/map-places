import {
  put,
  call,
  take,
  fork,
} from 'redux-saga/effects';

import makeAction, {
  request,
  requestFork,
  apiStart,
  apiSuccess,
  apiError,
} from 'helpers/reduxAction';


export function* apiFlow( api, actionName, deferred ) {

  let responseData = null;
  const dispatchedActionsTracker = {
    log: [],
    startAction: null,
    successAction: null,
    errorAction: null,
    addAction: function ( trackerType, action ) { // eslint-disable-line func-names
      if ( ~Object.keys(this).indexOf(trackerType) ) {
        this[trackerType] = action;
      }
      this.log.push( action );
    },
  };

  const _startedAction = makeAction( apiStart(actionName) );
  yield put( _startedAction );
  dispatchedActionsTracker.addAction('startAction', _startedAction);
  try {
    responseData = yield call( api );
    const _successAction = makeAction( apiSuccess(actionName), responseData );
    yield put( _successAction );
    dispatchedActionsTracker.addAction('successAction', _successAction);
    deferred.resolve(_successAction);
  }
  catch ( errorData ) {
    const _errorAction = makeAction( apiError(actionName), errorData );
    yield put( _errorAction );
    responseData = errorData;
    dispatchedActionsTracker.addAction('errorAction', _errorAction);
    deferred.reject(_errorAction);
  }

  return dispatchedActionsTracker;
}

export function createSagaWatcher( actionType, actionRunner ) {
  return function* () { // eslint-disable-line func-names
    while ( true ) { // eslint-disable-line no-constant-condition
      const action =  yield take([
        actionType,
        request(actionType),
        requestFork(actionType),
      ]);
      if ( action.type === request(actionType) ) {
        yield* actionRunner( action );
      }
      if ( action.type === requestFork(actionType) ) {
        fork( actionRunner, action );
      }
    }
  };
}

