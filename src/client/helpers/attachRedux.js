import { Component } from 'react';
import PropTypes from 'prop-types';
import { wrapDisplayName } from 'recompose';
import { Provider as ReduxStoreProvider } from 'react-redux';

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
function AttachReduxWithArgs(/* args */) {

  function AttachRedux( WrappedComponent ) {

    class AttachReduxHOC extends Component {
      static propTypes = {
        serverStoreInitialState: PropTypes.object,
      }

      static async getInitialProps( nextJSContext ) {

        if ( __SERVER__ ) {
          const { res } = nextJSContext;
          serverStore = createStore();
          serverStore.dispatch( makeAction(
            execute(ACTION_INCREMENT_COUNTER)
          ) );
          serverStoreInitialState = serverStore.getState();
          // Pass the store to the child components, for SSR.
          res.locals.reduxStore = serverStore;
        }
        let wrappedComponentInitialProps = {};
        if ( WrappedComponent.getInitialProps ) {
          wrappedComponentInitialProps = await WrappedComponent.getInitialProps(nextJSContext);
        }
        return {
          ...wrappedComponentInitialProps,
          serverStoreInitialState,
        };
      }

      constructor( props ) {
        super(props);
        if ( __CLIENT__ ) {
          if ( !clientStore ) {
            clientStore = createStore( props.serverStoreInitialState );
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
