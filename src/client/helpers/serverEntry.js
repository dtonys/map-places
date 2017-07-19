import { Component } from 'react';
import { wrapDisplayName } from 'recompose';


function serverEntry() {
  console.log('serverEntry::start');
}


function ServerEntryWithArgs(/* args */) {

  function ServerEntry( WrappedComponent ) {

    class ServerEntryHOC extends Component {
      static async getInitialProps( nextJSContext ) {
        let wrappedComponentInitialProps = {};
        if ( WrappedComponent.getInitialProps ) {
          wrappedComponentInitialProps = await WrappedComponent.getInitialProps(nextJSContext);
        }
        return wrappedComponentInitialProps;
      }

      constructor(props) {
        super(props);
        // Do server entry, on page load
        if ( __SERVER__ ) {
          serverEntry();
        }
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    ServerEntryHOC.displayName = wrapDisplayName( WrappedComponent, 'ServerEntryHOC' );
    return ServerEntryHOC;
  }

  return ServerEntry;
}

export default ServerEntryWithArgs;
