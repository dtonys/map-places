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


function* loadPlaces( action, webApiRequest ) {
  yield* apiFlow(
    loadPlacesApi.bind(null, webApiRequest),
    ACTION_LOAD_PLACES,
    { deferred: action.deferred, isLocalStorage: true }
  );
}

function* createPlace( action, webApiRequest ) {
  yield* apiFlow(
    createPlaceApi.bind( null, webApiRequest, action.payload),
    ACTION_CREATE_PLACE,
    { deferred: action.deferred, isLocalStorage: true },
  );
}
function* updatePlace( action, webApiRequest ) {
  yield* apiFlow(
    updatePlaceApi.bind( null, webApiRequest, action.payload),
    ACTION_UPDATE_PLACE,
    { deferred: action.deferred, isLocalStorage: true }
  );
}
function* getPlace( action, webApiRequest ) {
  yield* apiFlow(
    getPlaceApi.bind( null, webApiRequest, action.payload),
    ACTION_GET_PLACE,
    { deferred: action.deferred, isLocalStorage: true }
  );
}
function* deletePlace( action, webApiRequest ) {
  yield* apiFlow(
    deletePlaceApi.bind( null, webApiRequest, action.payload),
    ACTION_DELETE_PLACE,
    { deferred: action.deferred, isLocalStorage: true }
  );
}

function* placesSaga( webApiRequest ) {
  yield all([
    fork( createSagaWatcher(ACTION_LOAD_PLACES, loadPlaces, webApiRequest) ),
    // Create
    fork( createSagaWatcher(ACTION_CREATE_PLACE, createPlace, webApiRequest) ),
    fork( createSagaWatcher(ACTION_UPDATE_PLACE, updatePlace, webApiRequest) ),
    fork( createSagaWatcher(ACTION_GET_PLACE, getPlace, webApiRequest) ),
    fork( createSagaWatcher(ACTION_DELETE_PLACE, deletePlace, webApiRequest) ),
  ]);
}

export default placesSaga;
