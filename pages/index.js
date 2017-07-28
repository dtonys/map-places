import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import lodashFind from 'lodash/find';

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
} from 'redux-modules/actions/user';
import {
  ACTION_LOAD_PLACES,
} from 'redux-modules/actions/places';

import {
  SIDEBAR_WIDTH,
} from 'constants';

import {
  extractPlacesLoadedFromStorage,
  extractPlaces,
} from 'redux-modules/reducers/places';


@clientEntry()
@attachRedux()
@connect(
  (globalState) => ({
    placesLoadedFromStorage: extractPlacesLoadedFromStorage(globalState),
    places: extractPlaces(globalState),
  })
)
class HomePage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    placesLoadedFromStorage: PropTypes.bool.isRequired,
    places: PropTypes.object,
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
        this.props.dispatch( makeAction(
          request(ACTION_LOAD_PLACES)
        ) );
      });
  }

  componentDidUpdate( prevProps /* , prevState */) {
    const onPlacesLoaded = ( !prevProps.placesLoadedFromStorage && this.props.placesLoadedFromStorage );
    if ( onPlacesLoaded ) {
      this.populatePlacesFromStorage();
    }
  }

  populatePlacesFromStorage = () => {
    Object.keys(this.props.places).forEach(( placeID ) => {
      const { lat, lng, saved } = this.props.places[placeID];
      if ( saved ) {
        MapManager.attachMarkerToMap({
          lat,
          lng,
          saved,
        });
      }
    });
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
      });
  }

  loadUserData = () => {
    this.props.dispatch( makeAction(
      request(ACTION_LOAD_USER)
    ) );
  };

  onPlaceListItemClick = ( event ) => {
    const placeID = event.currentTarget.getAttribute('data-place-id');
    const place = this.props.places[placeID];
    MapManager.googleMap.panTo({
      lat: place.lat,
      lng: place.lng,
    });
  }

  render() {
    const {
      places,
    } = this.props;
    const hasActivatedPlace = Boolean(lodashFind( places, { saved: true }));

    return (
      <div>
        <Layout htmlTitle={'Home'}>
          {/* <MapDevTool /> */}
          <div className="mapSidebar">
            { hasActivatedPlace &&
              <div className="placeList">
                { Object.keys( places ).map(( placeKey ) => {
                  const place = places[placeKey];
                  if ( !place.saved ) {
                    return null;
                  }
                  return (
                    <div
                      className="placeListItem"
                      key={place.id}
                      data-place-id={ place.id }
                      onClick={this.onPlaceListItemClick}
                    >
                      {place.label || place.id}
                    </div>
                  );
                }) }
              </div>
            }
            {/*
              <button onClick={this.loadUserData} >
                {'loadUserData'}
              </button>
            */}
          </div>
          <div className="mapContent">
            {/* Map is inserted here dont put any children */}
            <div id="mapRegion" className="mapRegion" />
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

          .mapSidebar {
            position: absolute;
            border-right: solid black 2px;
            width: ${SIDEBAR_WIDTH}px;
            top: 0;
            left: 0;
            bottom: 0;
            overflow: auto;
            overflow-x: hidden;
          }
          .mapContent {
            position: absolute;
            top: 0;
            left: ${SIDEBAR_WIDTH}px;
            right: 0;
            bottom: 0;
          }
          .placeList {
          }
          .placeListItem {
            padding: 10px;
            border-bottom: solid black 2px;
            height: 4em;
            text-overflow: ellipsis;
          }
          .placeListItem:hover{
            background: #EEE;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }
}

export default HomePage;
