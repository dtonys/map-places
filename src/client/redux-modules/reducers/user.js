import {
  ACTION_LOAD_USER,
  ACTION_LOGIN,
  ACTION_RESET_PASSWORD,
  ACTION_LOST_PASSWORD,
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

// Selectors
export function extractAuthLoaded(globalState) {
  return lodashGet( extractState(globalState), 'loadUserApiMeta.loaded' );
}

export function extractAuthenticated(globalState) {
  return Boolean( lodashGet( extractState(globalState), 'currentUser' ));
}

export function extractCurrentUser(globalState) {
  return lodashGet( extractState(globalState), 'currentUser' );
}

export function extractLoginErrorMessage(globalState) {
  return lodashGet( extractState(globalState), 'loginApiMeta.error.message', null );
}

export function extractResetPasswordErrorMessage(globalState) {
  return lodashGet( extractState(globalState), 'resetPasswordApiMeta.error.message', null );
}

export function extractLostPasswordErrorMessage(globalState) {
  return lodashGet( extractState(globalState), 'lostPasswordApiMeta.error.message', null );
}


const initialState = {
  resetPasswordApiMeta: null,
  lostPasswordApiMeta: null,
  loadUserApiMeta: null,
  loginApiMeta: null,
  currentUser: null,
};
function reducer( state = initialState, action ) {
  switch ( action.type ) {
    // Reset Password
    case apiStart(ACTION_RESET_PASSWORD):
    case apiSuccess(ACTION_RESET_PASSWORD):
    case apiError(ACTION_RESET_PASSWORD): {
      return {
        resetPasswordApiMeta: metaReducer( state.resetPasswordApiMeta, action ),
      };
    }

    // Lost Password
    case apiStart(ACTION_LOST_PASSWORD):
    case apiSuccess(ACTION_LOST_PASSWORD):
    case apiError(ACTION_LOST_PASSWORD): {
      return {
        lostPasswordApiMeta: metaReducer( state.lostPasswordApiMeta, action ),
      };
    }

    // Login
    case apiStart(ACTION_LOGIN):
    case apiSuccess(ACTION_LOGIN):
    case apiError(ACTION_LOGIN): {
      return {
        loginApiMeta: metaReducer( state.loginApiMeta, action ),
      };
    }

    // Load user
    case apiStart(ACTION_LOAD_USER): {
      return {
        ...state,
        loadUserApiMeta: metaReducer( state.loadUserApiMeta, action ),
      };
    }
    case apiSuccess(ACTION_LOAD_USER): {
      return {
        ...state,
        currentUser: action.payload,
        loadUserApiMeta: metaReducer( state.loadUserApiMeta, action ),
      };
    }
    case apiError(ACTION_LOAD_USER): {
      return {
        ...state,
        loadUserApiMeta: metaReducer( state.loadUserApiMeta, action ),
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
