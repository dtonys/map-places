import { Component } from 'react';
import { connect } from 'react-redux';

import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';


@clientEntry()
@attachRedux()
@connect()
class SamplePage extends Component {

  render() {
    return (
      <div>
        SamplePage
      </div>
    );
  }

}

export default SamplePage;
