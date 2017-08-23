import {
  ACTION_SIGNUP,
} from 'redux-modules/actions/signup';
import metaReducer from 'redux-modules/reducers/meta';
import lodashGet from 'lodash/get';
import {
  apiStart,
  apiSuccess,
  apiError,
} from 'helpers/reduxAction';


// Store key
export const STORE_KEY = 'signup';

// Selectors
export function extractState(globalState) {
  return globalState[STORE_KEY];
}

export function extractSignupErrorMessage(globalState) {
  return lodashGet( extractState(globalState), 'signupApiMeta.error.message', null );
}

const initialState = {
  signupApiMeta: null,
};

function reducer( state = initialState, action ) {
  switch ( action.type ) {
    case apiStart(ACTION_SIGNUP):
    case apiSuccess(ACTION_SIGNUP):
    case apiError(ACTION_SIGNUP): {
      return {
        ...state,
        signupApiMeta: metaReducer( state.meta, action ),
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
