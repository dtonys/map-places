import {
  fork,
  all,
} from 'redux-saga/effects';
import counterSaga from 'redux-modules/sagas/counter';
import userSaga from 'redux-modules/sagas/user';

function* rootSaga() {
  yield all([
    fork(counterSaga),
    fork(userSaga),
  ]);
}

export default rootSaga;
