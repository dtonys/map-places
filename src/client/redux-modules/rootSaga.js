import {
  fork,
  all,
} from 'redux-saga/effects';
import counterSaga from 'redux-modules/sagas/counter';


function* rootSaga() {
  yield all([
    fork(counterSaga),
  ]);
}

export default rootSaga;
