import { Component } from 'react';
import PropTypes from 'prop-types';
import { wrapDisplayName } from 'recompose';
import { connect } from 'react-redux';

import makeAction, {
  request,
} from 'helpers/reduxAction';
import {
  ACTION_LOAD_USER,
} from 'redux-modules/actions/user';
import { Router } from 'routes/pageRoutes';

import {
  extractAuthLoaded,
  extractAuthenticated,
} from 'redux-modules/reducers/user';

// Ideas for options:
// @authenticated( true )
// @authenticated({ role: 'admin' })

function AuthenticatedPageWithOptions( options ) {

  function AuthenticatedPage( WrappedComponent ) {

    @connect(
      (globalState) => ({
        authenticated: extractAuthenticated(globalState),
      })
    )
    class AuthenticatedPageHOC extends Component {
      static propTypes = {
        authenticated: PropTypes.bool.isRequired,
      }

      static redirectToLogin( context ) {
        if ( __SERVER__ ) {
          const { req, res } = context;
          const nextPath = encodeURIComponent(req.originalUrl);
          res.redirect(`/login?next=${nextPath}`);
        }
        if ( __CLIENT__ ) {
          const nextPath = encodeURIComponent(context.asPath);
          Router.replaceRoute(`/login?next=${nextPath}`);
        }
      }

      static async getInitialProps( context ) {
        let wrappedComponentInitialProps = {};
        const { store } = context;
        const globalState = store.getState();

        const userAuthenticated = extractAuthenticated(globalState);
        if ( !userAuthenticated ) {
          AuthenticatedPageHOC.redirectToLogin(context);
        }
        if ( WrappedComponent.getInitialProps ) {
          wrappedComponentInitialProps = await WrappedComponent.getInitialProps(context);
        }
        return wrappedComponentInitialProps;
      }

      componentWillMount() {
        if ( __CLIENT__ ) {
          // if not authenticated, redirect to login with next path
          // if ( !this.props.authenticated ) {
          //   const nextPath = encodeURIComponent(window.location.pathname + window.location.search);
          //   Router.replaceRoute(`/login?next=${nextPath}`);
          // }
        }
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }

    }
    AuthenticatedPageHOC.displayName = wrapDisplayName( WrappedComponent, 'AuthenticatedPageHOC' );
    return AuthenticatedPageHOC;
  }
  return AuthenticatedPage;
}

export default AuthenticatedPageWithOptions;
