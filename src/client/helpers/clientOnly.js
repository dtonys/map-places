import { Component } from 'react';
import { wrapDisplayName } from 'recompose';


function clientOnly( WrappedComponent ) {

  class clientOnlyHOC extends Component {

    constructor( props ) {
      super(props);
      this.state = {
        clientLoaded: false,
      };
    }

    componentDidMount() {
      this.setState({ // eslint-disable-line
        clientLoaded: true,
      });
    }

    render() {
      const { clientLoaded } = this.state;
      if ( clientLoaded ) {
        return ( <WrappedComponent {...this.props} /> );
      }
      return (<div></div>);
    }
  }
  clientOnlyHOC.displayName = wrapDisplayName( WrappedComponent, 'clientOnlyHOC' );
  return clientOnlyHOC;
}

export default clientOnly;
