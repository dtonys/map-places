import {
  fork,
  all,
} from 'redux-saga/effects';
import counterSaga from 'redux-modules/sagas/counter';
import userSaga from 'redux-modules/sagas/user';
import placesSaga from 'redux-modules/sagas/places';
import signupSaga from 'redux-modules/sagas/signup';


function* rootSaga( webApiRequest ) {
  yield all([
    fork(counterSaga, webApiRequest),
    fork(userSaga, webApiRequest),
    fork(placesSaga, webApiRequest),
    fork(signupSaga, webApiRequest),
  ]);
}

export default rootSaga;
