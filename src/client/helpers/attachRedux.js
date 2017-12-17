import { Component } from 'react';
import PropTypes from 'prop-types';
import { wrapDisplayName } from 'recompose';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { END as REDUX_SAGA_END } from 'redux-saga';

import rootSaga from 'redux-modules/rootSaga';
import createStore from 'redux-modules/createStore';
import makeAction, {
  execute,
  request,
} from 'helpers/reduxAction';
import {
  ACTION_LOAD_USER,
} from 'redux-modules/actions/user';
import {
  ACTION_INCREMENT_COUNTER,
} from 'redux-modules/actions/counter';

import { createWebApiRequest } from 'web-api/webApiRequest';

export async function loadUserData(store) {
  store.dispatch( makeAction(
    execute(ACTION_INCREMENT_COUNTER)
  ) );
  // Load user on every page
  await store.dispatch( makeAction(
    request( ACTION_LOAD_USER ),
    null,
    { deferred: true }
  ) );
}

export function createStoreWithSaga({ req, initialState } = {}) {
  const { store, sagaMiddleware } = createStore(initialState);
  const webApiRequest = createWebApiRequest({ req });
  const rootTask = sagaMiddleware.run(rootSaga, webApiRequest);
  return {
    store,
    rootTask,
  };
}

export async function endSagaAndGetInitialState( store, rootTask ) {
  // Dispatch END, prevents new actions from coming in.  Existing actions will finish.
  store.dispatch(REDUX_SAGA_END);
  // Wait for remaining actions to finish.
  await rootTask.done;
  // Return current state
  return store.getState();
}

let clientStore = null;
let serverStore = null;
let serverStoreInitialState = null;
let rootTask = null;
function AttachReduxWithArgs(/* args */) {

  function AttachRedux( WrappedComponent ) {

    class AttachReduxHOC extends Component {
      static propTypes = {
        serverStoreInitialState: PropTypes.object,
      }

      static async getInitialProps( context ) {

        // allow client side `getInitialProps` calls to access state and dispatch
        if ( __CLIENT__ ) {
          if ( clientStore ) {
            context.store = clientStore;
          }
        }

        if ( __SERVER__ ) {
          const { req } = context;
          const storeData = createStoreWithSaga({ req });
          // Load initial user data
          await loadUserData( storeData.store );
          // Set local variables
          serverStore = storeData.store;
          rootTask = storeData.rootTask;
          // Pass the store to the child component so it can access state and dispatch
          context.store = serverStore;
        }

        let wrappedComponentInitialProps = {};
        // Let the child components execute their actions as needed
        if ( WrappedComponent.getInitialProps ) {
          wrappedComponentInitialProps = await WrappedComponent.getInitialProps(context);
        }

        if ( __SERVER__ ) {
          serverStoreInitialState = await endSagaAndGetInitialState( serverStore, rootTask );
          return {
            ...wrappedComponentInitialProps,
            serverStoreInitialState,
          };
        }
        return wrappedComponentInitialProps;
      }

      constructor( props ) {
        super(props);
        if ( __CLIENT__ ) {
          if ( !clientStore ) {
            const storeData = createStoreWithSaga({
              initialState: props.serverStoreInitialState,
            });
            clientStore = storeData.store;
            window.store = clientStore;
          }
        }
      }

      render() {
        const store = serverStore || clientStore;

        return (
          <ReduxStoreProvider store={store} >
            <WrappedComponent {...this.props} />
          </ReduxStoreProvider>
        );
      }
    }

    AttachReduxHOC.displayName = wrapDisplayName( WrappedComponent, 'AttachReduxHOC' );
    return AttachReduxHOC;
  }
  return AttachRedux;
}
export default AttachReduxWithArgs;
