import { Component } from 'react';
import testJSON from './test.json';


export default class JSONSchemaPage extends Component {
  render() {
    return (
      <div className="container">
        container
        <div className="json">
          {JSON.stringify(testJSON)}
        </div>
      </div>
    )
  }
}