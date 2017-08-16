import {
  ACTION_LOAD_USER,
  ACTION_LOGIN,
} from 'redux-modules/actions/user';

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

const currentUserInitialState = {
  meta: null,
  data: null,
};
function currentUserReducer( state = currentUserInitialState, action ) {
  return state;
  // switch ( action.type ) {
  //   case apiSuccess(ACTION_LOAD_USER): {
  //     return action.payload;
  //   }
  //   default: {
  //     return state;
  //   }
  // }
}

const loginInitialState = {
  meta: null,
};
function loginReducer( state = loginInitialState, action ) {
  switch ( action.type ) {
    case apiStart(ACTION_LOGIN):
    case apiSuccess(ACTION_LOGIN):
    case apiError(ACTION_LOGIN): {
      return {
        meta: metaReducer( state.meta, action ),
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
