import {
  ACTION_INCREMENT_COUNTER,
  ACTION_DECREMENT_COUNTER,
} from 'redux-modules/actions/counter';


export const STORE_KEY = 'counter';

// Initial state
const initialState = 0;

// Selectors
export function extractState(globalState) {
  return globalState[STORE_KEY] || initialState;
}

// Reducer
function reducer( state = initialState, action ) {
  switch ( action.type ) {
    case ACTION_INCREMENT_COUNTER: {
      return state + 1;
    }

    case ACTION_DECREMENT_COUNTER: {
      return state - 1;
    }

    default: {
      return state;
    }
  }
}

export default reducer;
