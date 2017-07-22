import {
  ACTION_LOAD_USER,
  ACTION_LOAD_PAGE,
} from 'redux-modules/actions/user';

import {
  apiStart,
  apiSuccess,
  apiError,
} from 'helpers/reduxAction';

// Store key
export const STORE_KEY = 'user';

// Initial state
const initialState = {
  meta: {
    loading: false,
    loaded: false,
    error: null,
  },
  data: {
    name: null,
  },
  pageData: {
  },
};

// Selectors
export function extractState(globalState) {
  return globalState[STORE_KEY];
}

// Reducer
function reducer( state = initialState, action ) {
  switch ( action.type ) {
    case apiStart(ACTION_LOAD_USER): {
      return {
        ...state,
        meta: {
          ...state.meta,
          loading: true,
        },
      };
    }
    case apiSuccess(ACTION_LOAD_USER): {
      return {
        ...state,
        meta: {
          ...state.meta,
          loaded: true,
          loading: false,
        },
        data: action.payload,
      };
    }
    case apiError(ACTION_LOAD_USER): {
      return {
        ...state,
        meta: {
          ...state.meta,
          loading: false,
          error: action.payload,
        },
      };
    }

    case apiSuccess(ACTION_LOAD_PAGE): {
      return {
        ...state,
        pageData: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
