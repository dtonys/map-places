import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Layout from 'components/Layout';
import MapManager, {
  BASIC_MAP_TYPES,
  getIsGoogleMapsLoaded,
} from 'helpers/MapManager';

import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';

import {
  tryGetCurrentPosition,
} from 'helpers/browserUtils';

import makeAction, {
  request,
  execute,
} from 'helpers/reduxAction';
import {
  ACTION_INCREMENT_COUNTER,
  ACTION_DECREMENT_COUNTER,
  ACTION_INCREMENT_COUNTER_ASYNC,
} from 'redux-modules/actions/counter';
import {
  ACTION_LOAD_USER,
  ACTION_LOAD_PAGE,
} from 'redux-modules/actions/user';

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

@clientEntry()
@attachRedux()
@connect(
  ( globalState ) => ({
    counterValue: globalState.counter,
  })
)
class HomePage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    counterValue: PropTypes.number.isRequired,
  }

  // NOTE: Context object contains:
  // pathname,             // path section of URL
  // query,                // query string parsed into object
  // asPath,               // the actual url path
  // req: expressRequest,  // req from server  (__SERVER__)
  // res: expressResponse, // res from server  (__SERVER__)
  // jsonPageRes,          // page response on client (__CLIENT__)

  static async getInitialProps( context ) {
    // const {
    //   req: expressRequest,
    //   res: expressResponse,
    // } = context;
    const homePageFetched = await new Promise(( resolve ) => {
      setTimeout( resolve.bind( null, true ), 100);
    });
    return { homePageFetched };
  }

  constructor(props) {
    super(props);
    this.currentPositionLatLng = null;
    const isGoogleMapsLoaded = getIsGoogleMapsLoaded();
    this.state = {
      count: 0,
      mapLoaded: isGoogleMapsLoaded,
      currentPositionLatLng: null,
    };
  }

  surroundCurrentPositionWithMarkers = ({ lat, lng }) => {
    MapManager.attachMarkerToMap({ lat: lat + 0.03, lng });
    MapManager.attachMarkerToMap({ lat, lng: lng + 0.03 });
    MapManager.attachMarkerToMap({ lat: lat - 0.03, lng });
    MapManager.attachMarkerToMap({ lat, lng: lng - 0.03 });
  }

  componentDidMount() {
    if ( !this.state.mapLoaded ) {
      MapManager.initializeComplete
        .then(() => {
          this.setState({
            mapLoaded: true,
          });
        });
    }
    else {
      MapManager.insertMapToDom(document.querySelector('#mapRegion'));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const onMapLoaded = !prevState.mapLoaded && this.state.mapLoaded;
    if ( onMapLoaded ) {
      this.initializeMap();
    }
  }

  initializeMap = () => {
    MapManager.insertMapToDom(document.querySelector('#mapRegion'));
    tryGetCurrentPosition()
      .then(({ lat, lng }) => {
        this.setState({
          currentPositionLatLng: { lat, lng },
        });
        MapManager.googleMap.setCenter({ lat, lng });
        MapManager.attachMarkerToMap({ lat, lng });
        this.surroundCurrentPositionWithMarkers({ lat, lng });
      });
  }

  centerMapOnCurrentPosition = () => {
    MapManager.googleMap.setCenter(this.state.currentPositionLatLng);
  }

  incrementCounterAsync = () => {
    this.props.dispatch( makeAction(
      request(ACTION_INCREMENT_COUNTER_ASYNC),
      { delayMs: 2000 }
    ) );
  }

  incrementCounter = () => {
    this.props.dispatch( makeAction(
      execute(ACTION_INCREMENT_COUNTER)
    ) );
  }

  decrementCounter = () => {
    this.props.dispatch( makeAction(
      execute(ACTION_DECREMENT_COUNTER)
    ) );
  }

  loadUserData = () => {
    this.props.dispatch( makeAction(
      request(ACTION_LOAD_USER)
    ) );
  }

  loadPageData = () => {
    this.props.dispatch( makeAction(
      request(ACTION_LOAD_PAGE)
    ) );
  };

  render() {
    const {
      currentPositionLatLng,
    } = this.state;
    const {
      counterValue,
    } = this.props;

    return (
      <div>
        <Layout htmlTitle={'Home'}>
          {/* <div>{JSON.stringify(this.props)}</div> */}
          <MapDevTool />
          <div>{`Redux Counter: ${counterValue}`}</div>
          <button onClick={this.loadPageData} >
            {'loadPageData'}
          </button>
          <button onClick={this.loadUserData} >
            {'loadUserData'}
          </button>
          <button onClick={this.incrementCounterAsync} >
            {'incrementCounterAsyc'}
          </button>
          <button onClick={this.incrementCounter} >
            {'Redux Inc Counter'}
          </button>
          <button onClick={this.decrementCounter} >
            {'Redux Dec Counter'}
          </button>
          <div className="mapRegionWrap">
            <div id="mapRegion" className="mapRegion" />
            { currentPositionLatLng &&
              <div>
                <button
                  className="centerMap"
                  onClick={this.centerMapOnCurrentPosition} >
                  center
                </button>
                <div className="legend" >
                  Legend
                </div>
              </div>
            }
          </div>
        </Layout>
        <style jsx>{`
          .mapRegionWrap {
            height: 100%;
            position: relative;
          }
          #mapRegion {
            height: 100%;
            background: grey;
          }
          .legend {
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            border: solid black 2px;
            background: white;
          }
          .centerMap {
            position: absolute;
            top: 10px;
            left: 50%;
            width: 100px;
            margin-left: -50px;
            min-height: 0px;
            padding: 2px 20px;
            background: white;
            color: black;
            border: solid black 2px;
          }
        `}</style>
      </div>
    );
  }
}

export default HomePage;
