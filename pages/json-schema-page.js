import { Component } from 'react';
import User from 'src/server/models/user.js';


export default class JSONSchemaPage extends Component {

  render() {
    return (
      <div className="container">
        container
        <div className="json">
          {JSON.stringify(User.jsonSchema())}
        </div>
      </div>
    )
  }
}
