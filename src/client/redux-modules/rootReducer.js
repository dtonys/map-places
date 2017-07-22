// External library reducers

// Own app reducers
import counter, { STORE_KEY as COUNTER_STORE_KEY } from 'redux-modules/reducers/counter';
import user, { STORE_KEY as USER_STORE_KEY } from 'redux-modules/reducers/user';

// Global / debug reducers
// function mockGlobalReducer( state, action ) {
//   return state;
// }

export default function rootReducer( state = {}, action ) {
  let nextState = state;
  nextState = {
    [COUNTER_STORE_KEY]: counter( nextState[COUNTER_STORE_KEY], action ),
    [USER_STORE_KEY]: user( nextState[USER_STORE_KEY], action ),
  };
  // nextState = mockGlobalReducer( nextState, action );
  return nextState;
}
