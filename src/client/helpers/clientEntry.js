// HOC for client side entry
import { Component } from 'react';
import { wrapDisplayName } from 'recompose';

import MapManager from 'helpers/MapManager';


let clientEntryRun = false;
// NOTE: Perform client side initialization here.  This is run once only.
function clientEntry() {
  MapManager.initialize({
    initialCenterLatLng: {
      lat: 37.549854,
      lng: -122.291353,
    },
  });
}


function ClientEntryWithArgs(/* args */) {

  function ClientEntry( WrappedComponent ) {

    class ClientEntryHOC extends Component {
      static async getInitialProps( nextJSContext ) {
        let wrappedComponentInitialProps = {};
        if ( WrappedComponent.getInitialProps ) {
          wrappedComponentInitialProps = await WrappedComponent.getInitialProps(nextJSContext);
        }
        return wrappedComponentInitialProps;
      }

      constructor(props) {
        super(props);
        // Run client entry, once
        if ( __CLIENT__ ) {
          if ( !clientEntryRun ) {
            clientEntry();
            clientEntryRun = true;
          }
        }
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    ClientEntryHOC.displayName = wrapDisplayName( WrappedComponent, 'ClientEntryHOC' );
    return ClientEntryHOC;
  }
  return ClientEntry;
}

export default ClientEntryWithArgs;
