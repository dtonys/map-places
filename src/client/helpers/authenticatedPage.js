import { Component } from 'react';
import { wrapDisplayName } from 'recompose';
import lodashDifference from 'lodash/difference';

import { Router } from 'routes/pageRoutes';

import {
  extractCurrentUser,
} from 'redux-modules/reducers/user';

// @authenticated()
// @authenticated({ requiredRoles: ['admin', 'member'] })
function AuthenticatedPageWithOptions( options = {} ) {

  function AuthenticatedPage( WrappedComponent ) {

    class AuthenticatedPageHOC extends Component {
      static authRedirect( context, authenticated ) {
        if ( __SERVER__ ) {
          const { req, res } = context;
          const redirectPath = authenticated ? '/' : `/login?next=${encodeURIComponent(req.originalUrl)}`;
          res.redirect(redirectPath);
        }
        if ( __CLIENT__ ) {
          const redirectPath = authenticated ? '/' : `/login?next=${encodeURIComponent(context.asPath)}`;
          Router.replaceRoute(redirectPath);
        }
      }

      static async getInitialProps( context ) {
        const { store } = context;
        const globalState = store.getState();

        const currentUser = extractCurrentUser(globalState);
        if ( !currentUser ) {
          AuthenticatedPageHOC.authRedirect(context, false);
          return {};
        }
        if (
          options.requiredRoles &&
          lodashDifference(options.requiredRoles, currentUser.roles).length !== 0
        ) {
          AuthenticatedPageHOC.authRedirect(context, Boolean(currentUser));
          return {};
        }
        let wrappedComponentInitialProps = {};
        if ( WrappedComponent.getInitialProps ) {
          wrappedComponentInitialProps = await WrappedComponent.getInitialProps(context);
        }
        return wrappedComponentInitialProps;
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
