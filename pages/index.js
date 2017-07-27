import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Layout from 'components/Layout';
import MapManager from 'helpers/MapManager';

import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';

import {
  tryGetCurrentPosition,
} from 'helpers/browserUtils';

import makeAction, {
  request,
} from 'helpers/reduxAction';
import  {
  DEFERRED,
} from 'redux-modules/middleware/sagaPromiseMiddlware';

import {
  ACTION_LOAD_USER,
  ACTION_LOAD_PAGE,
} from 'redux-modules/actions/user';

import {
  SIDEBAR_WIDTH,
} from 'constants';


@clientEntry()
@attachRedux()
@connect()
class HomePage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  // NOTE: Context object contains:
  // pathname,             // path section of URL
  // query,                // query string parsed into object
  // asPath,               // the actual url path
  // req: expressRequest,  // req from server  (__SERVER__)
  // res: expressResponse, // res from server  (__SERVER__)
  // jsonPageRes,          // page response on client (__CLIENT__)

  static async getInitialProps( context ) {
    const { res } = context;
    let successAction = null;
    try {
      successAction = await res.locals.reduxStore.dispatch({
        ...makeAction( request( ACTION_LOAD_USER ) ),
        [DEFERRED]: true, // This action returns a promise
      });
    }
    catch ( errorAction ) {
      // USER NOT LOGGED IN, try a redirect to login page
    }
    return {
      user: ( successAction && successAction.payload
        ? successAction.payload
        : null  ),
    };
  }

  constructor(props) {
    super(props);
    this.currentPositionLatLng = null;
    this.state = {
      currentPositionLatLng: null,
    };
  }

  componentDidMount() {
    MapManager.initializeComplete
      .then(() => {
        this.initializeMap();
      });
  }

  surroundCurrentPositionWithMarkers = ({ lat, lng }) => {
    MapManager.attachMarkerToMap({ lat: lat + 0.03, lng });
    MapManager.attachMarkerToMap({ lat, lng: lng + 0.03 });
    MapManager.attachMarkerToMap({ lat: lat - 0.03, lng });
    MapManager.attachMarkerToMap({ lat, lng: lng - 0.03 });
  }

  centerMapOnCurrentPosition = () => {
    MapManager.googleMap.setCenter(this.state.currentPositionLatLng);
  }

  initializeMap() {
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

  loadPageData = () => {
    this.props.dispatch( makeAction(
      request(ACTION_LOAD_PAGE)
    ) );
  };

  render() {
    const {
      currentPositionLatLng,
    } = this.state;

    return (
      <div>
        <Layout htmlTitle={'Home'}>
          {/* <MapDevTool /> */}
          <div className="mapSidebar">
            LeftRegion
          </div>
          <div className="mapContent">
            <div id="mapRegion" className="mapRegion" >
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
          </div>
          {/*
            <div className="mapRegionWrap">

          */}

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

          .mapSidebar {
            position: absolute;
            border-right: solid black 2px;
            width: ${SIDEBAR_WIDTH}px;
            top: 0;
            left: 0;
            bottom: 0;
          }
          .mapContent {
            position: absolute;
            top: 0;
            left: ${SIDEBAR_WIDTH}px;
            right: 0;
            bottom: 0;
          }
        `}</style>
      </div>
    );
  }
}

export default HomePage;
