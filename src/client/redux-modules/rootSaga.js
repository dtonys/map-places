import {
  fork,
  all,
} from 'redux-saga/effects';
import counterSaga from 'redux-modules/sagas/counter';
import userSaga from 'redux-modules/sagas/user';
import placesSaga from 'redux-modules/sagas/places';


function* rootSaga() {
  yield all([
    fork(counterSaga),
    fork(userSaga),
    fork(placesSaga),
  ]);
}

export default rootSaga;
