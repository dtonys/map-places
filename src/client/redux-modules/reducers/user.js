import {
  ACTION_LOAD_USER,
} from 'redux-modules/actions/user';

import {
  apiSuccess,
} from 'helpers/reduxAction';

import metaReducer from 'redux-modules/reducers/meta';

// Store key
export const STORE_KEY = 'user';

export const initialState = {
  name: null,
};

// Selectors
export function extractState(globalState) {
  return globalState[STORE_KEY];
}

// Reducer
function dataReducer( state = initialState, action ) {
  // const meta = metaReducer( state.meta, action );
  switch ( action.type ) {
    case apiSuccess(ACTION_LOAD_USER): {
      return action.payload;
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
