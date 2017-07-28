import {
  fork,
  all,
  // take,
} from 'redux-saga/effects';
import {
  apiFlow,
  createSagaWatcher,
} from 'helpers/sagaHelpers';
import {
  DEFERRED,
} from 'redux-modules/middleware/sagaPromiseMiddlware';
import {
  // loadPlacesApi,
  // createPlaceApi,
  // updatePlaceApi,
  // getPlaceApi,
  // deletePlaceApi,
} from 'web-api/index';
import {
  loadPlacesApi,
  createPlaceApi,
  updatePlaceApi,
  getPlaceApi,
  deletePlaceApi,
} from 'web-api/localStorageMockApi';


import {
  ACTION_LOAD_PLACES,
  ACTION_CREATE_PLACE,
  ACTION_UPDATE_PLACE,
  ACTION_GET_PLACE,
  ACTION_DELETE_PLACE,
} from 'redux-modules/actions/places';


function* loadPlaces({ [DEFERRED]: deferred }) {
  yield* apiFlow(
    loadPlacesApi,
    ACTION_LOAD_PLACES,
    { deferred, isLocalStorage: true }
  );
}

function* createPlace({
  [DEFERRED]: deferred,
  payload,
}) {
  yield* apiFlow(
    createPlaceApi.bind( null, payload),
    ACTION_CREATE_PLACE,
    { deferred, isLocalStorage: true },
  );
}
function* updatePlace({
  [DEFERRED]: deferred,
  payload,
}) {
  yield* apiFlow(
    updatePlaceApi.bind( null, payload),
    ACTION_UPDATE_PLACE,
    { deferred, isLocalStorage: true }
  );
}
function* getPlace({
  [DEFERRED]: deferred,
  payload,
}) {
  yield* apiFlow(
    getPlaceApi.bind( null, payload),
    ACTION_GET_PLACE,
    { deferred, isLocalStorage: true }
  );
}
function* deletePlace({
  [DEFERRED]: deferred,
  payload,
}) {
  yield* apiFlow(
    deletePlaceApi.bind( null, payload),
    ACTION_DELETE_PLACE,
    { deferred, isLocalStorage: true }
  );
}

function* places() {
  yield all([
    fork( createSagaWatcher(ACTION_LOAD_PLACES, loadPlaces) ),
    // Create
    fork( createSagaWatcher(ACTION_CREATE_PLACE, createPlace) ),
    fork( createSagaWatcher(ACTION_UPDATE_PLACE, updatePlace) ),
    fork( createSagaWatcher(ACTION_GET_PLACE, getPlace) ),
    fork( createSagaWatcher(ACTION_DELETE_PLACE, deletePlace) ),
  ]);
}

export default places;
