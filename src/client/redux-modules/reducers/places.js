import {
  ACTION_LOAD_PLACES,
  ACTION_CREATE_PLACE,
  ACTION_UPDATE_PLACE,
  ACTION_GET_PLACE,
  ACTION_DELETE_PLACE,
} from 'redux-modules/actions/places';

// Store key
export const STORE_KEY = 'places';

import {
  // apiStart,
  // apiSuccess,
  // apiError,
  // localStorageStart,
  localStorageSuccess,
} from 'helpers/reduxAction';

// import metaReducer from 'redux-modules/reducers/meta';

/*
Location: {
  lat,
  lng,
  city,
  state,
  zip,
  country,
  address_1,
  address_2
}

*/

/*
// Place:
<lat>_<lng>: {
  id,
  name,
  location: <Location_id>,
  active,
}
*/

// Initial state
const initialState = {};

// Selectors
// Selectors
export function extractState(globalState) {
  return globalState[STORE_KEY];
}

export function extractPlaces( globalState ) {
  return globalState[STORE_KEY].data;
}

// Reducer
function dataReducer( state = initialState, action ) {
  switch ( action.type ) {
    case localStorageSuccess(ACTION_LOAD_PLACES): {
      return action.payload;
    }
    case localStorageSuccess(ACTION_CREATE_PLACE): {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case localStorageSuccess(ACTION_UPDATE_PLACE): {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    }
    case localStorageSuccess(ACTION_GET_PLACE): {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case localStorageSuccess(ACTION_DELETE_PLACE): {
      const stateWithItemRemoved = {
        ...state,
      };
      delete stateWithItemRemoved[action.payload.id];
      return stateWithItemRemoved;
    }
    default: {
      return state;
    }
  }
}

const initialMetaState = {
  placesLoadedFromStorage: false,
};

export function extractPlacesLoadedFromStorage( globalState ) {
  return globalState[STORE_KEY].meta.placesLoadedFromStorage;
}

function metaReducer( state = initialMetaState, action ) {
  switch ( action.type ) {
    case localStorageSuccess(ACTION_LOAD_PLACES): {
      return {
        ...state,
        placesLoadedFromStorage: true,
      };
    }
    default: {
      return state;
    }
  }
}

function reducer( state = {}, action ) {
  return {
    data: dataReducer( state.data, action ),
    meta: metaReducer( state.meta, action ),
  };
}

export default reducer;
