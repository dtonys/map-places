import { Component } from 'react';
import PropTypes from 'prop-types';
import { wrapDisplayName } from 'recompose';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { END as REDUX_SAGA_END } from 'redux-saga';

import rootSaga from 'redux-modules/rootSaga';
import createStore from 'redux-modules/createStore';
import makeAction, {
  execute,
} from 'helpers/reduxAction';

import {
  ACTION_INCREMENT_COUNTER,
} from 'redux-modules/actions/counter';

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

        if ( __SERVER__ ) {
          const { res } = context;
          const { store, sagaMiddleware } = createStore();
          serverStore = store;
          rootTask = sagaMiddleware.run(rootSaga);
          serverStore.dispatch( makeAction(
            execute(ACTION_INCREMENT_COUNTER)
          ) );
          // Pass the store so the child component can dispatch actions in it's own getInitialProps
          res.locals.reduxStore = serverStore;
        }
        let wrappedComponentInitialProps = {};
        // Let the child components execute their actions as needed
        if ( WrappedComponent.getInitialProps ) {
          wrappedComponentInitialProps = await WrappedComponent.getInitialProps(context);
        }
        if ( __SERVER__ ) {
          // Dispatch END, prevents new actions from coming in.  Existing actions will finish.
          serverStore.dispatch(REDUX_SAGA_END);
          // Wait for remaining actions to finish.
          await rootTask.done;
          // Make initial state be available to the client as a prop
          serverStoreInitialState = serverStore.getState();
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
            const { store, sagaMiddleware } = createStore( props.serverStoreInitialState );
            clientStore = store;
            sagaMiddleware.run(rootSaga);
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
