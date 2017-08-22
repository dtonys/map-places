import {
  ACTION_LOAD_USER,
  ACTION_LOGIN,
} from 'redux-modules/actions/user';
import lodashGet from 'lodash/get';

import {
  apiStart,
  apiSuccess,
  apiError,
} from 'helpers/reduxAction';

import metaReducer from 'redux-modules/reducers/meta';


// Store key
export const STORE_KEY = 'user';

// Selectors
export function extractState(globalState) {
  return globalState[STORE_KEY];
}

export function extractLoginErrorMessage(globalState) {
  return lodashGet( globalState[STORE_KEY].login, 'apiMeta.error.message', null );
}

const currentUserInitialState = {
  meta: null,
  data: null,
};
function currentUserReducer( state = currentUserInitialState, action ) {
  switch ( action.type ) {
    case apiStart(ACTION_LOAD_USER): {
      return {
        ...state,
        apiMeta: metaReducer( state.apiMeta, action ),
      };
    }
    case apiSuccess(ACTION_LOAD_USER): {
      return {
        ...state,
        data: action.payload,
        apiMeta: metaReducer( state.apiMeta, action ),
      };
    }
    case apiError(ACTION_LOAD_USER): {
      return {
        ...state,
        apiMeta: metaReducer( state.apiMeta, action ),
      };
    }
    default: {
      return state;
    }
  }
}

const loginInitialState = {};
function loginReducer( state = loginInitialState, action ) {
  switch ( action.type ) {
    case apiStart(ACTION_LOGIN):
    case apiSuccess(ACTION_LOGIN):
    case apiError(ACTION_LOGIN): {
      return {
        apiMeta: metaReducer( state.apiMeta, action ),
      };
    }
    default: {
      return state;
    }
  }
}

// login
// user

function reducer( state = {}, action ) {
  return {
    currentUser: currentUserReducer( state.currentUser, action ),
    login: loginReducer( state.login, action ),
  };
}

export default reducer;
