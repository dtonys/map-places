// NOTE: Next.js does not have a standard client side entry point.
// This HOC allows one time client side scripts to be run, it must be applied to
// all page components in the /pages directory.
// See https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e
import { Component } from 'react';
import MapManager from 'helpers/MapManager';
import { wrapDisplayName } from 'recompose';

let clientEntryRun = false;
// NOTE: Perform client side initialization here.  This is run once on page load.
function clientEntry() {
  MapManager.initialize();
}

function ClientEntryHOCCreator( WrappedComponent ) {
  class ClientEntryHOC extends Component {
    constructor( props ) {
      if ( __CLIENT__ && !clientEntryRun ) {
        clientEntry();
        clientEntryRun = true;
      }
      super(props);
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  ClientEntryHOC.displayName = wrapDisplayName( WrappedComponent, 'clientEntry' );
  return ClientEntryHOC;
}
export default ClientEntryHOCCreator;
