import { Component } from 'react';
import PropTypes from 'prop-types';

import {
  BASIC_MAP_TYPES
} from 'helpers/MapManager';

class MapDevTool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      values: {
        mapTypeId: BASIC_MAP_TYPES[0],
      },
    };
  }

  onInputChange = ( event ) => {
    const value = event.target.value;
    const inputKey = event.currentTarget.getAttribute('data-input-key');

    this.setState({
      values: {
        ...this.state.values,
        [inputKey]: value,
      },
    });

    if ( inputKey === 'mapTypeId' ) {
      MapManager.googleMap.setMapTypeId(value);
    }
  }

  toggleShow = () => {
    this.setState({
      show: !this.state.show,
    });
  }

  render() {
    const {
      show,
      values: {
        mapTypeId,
      },
    } = this.state;

    return (
      <div>

        { !show && (
          <button
            className="mapDevToolShow"
            onClick={this.toggleShow}
          >{'Dev'}</button>
        )}
        { show && (
          <div className="mapDevTool">
            <p>Map Dev Tool</p>
            <button
              className="mapDevToolHide"
              onClick={this.toggleShow}
            >{'Hide'}</button>
            <select
              value={mapTypeId}
              data-input-key={'mapTypeId'}
              onChange={this.onInputChange}
            >
              { BASIC_MAP_TYPES.map((basicMapType) => (
                <option
                  key={basicMapType}
                  value={basicMapType}
                >
                  {basicMapType}
                </option>
              ))}
            </select>
          </div>
        )}
        <style jsx>{`
          .mapDevToolShow {
            position: absolute;
            top: 0;
            right: 0;
          }
          .mapDevToolHide {
            position: absolute;
            top: 0;
            right: 0;
          }
          .mapDevTool {
            position: absolute;
            top: 0;
            right: 0;
            width: 200px;
            padding: 10px;
            border: solid black 1px;
          }
        `}</style>
      </div>
    );
  }
}

export default MapDevTool;
