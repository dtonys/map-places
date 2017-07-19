import { createStore as reduxCreateStore } from 'redux';

import rootReducer from 'redux-modules/rootReducer';

function createStore( initialState ) {
  const store = reduxCreateStore(rootReducer, initialState);
  return store;
}

export default createStore;
