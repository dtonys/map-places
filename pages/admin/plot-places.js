import { Component } from 'react';
import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';

import MapManager, {
  getIsGoogleMapsLoaded,
} from 'helpers/MapManager';

import {
  NAVBAR_HEIGHT,
} from 'constants';

const CONTENT_REGION_WIDTH = 960;
const ACTIVE_ICON_PATH = '/static/pin_w30_active.svg';
const ICON_PATH = '/static/pin_w30.svg';

@clientEntry()
@attachRedux()
class PlotPlaces extends Component {

  constructor( props ) {
    super(props);
    const isGoogleMapsLoaded = getIsGoogleMapsLoaded();
    this.state = {
      mapLoaded: isGoogleMapsLoaded,
      form: {
        lat: '',
        lng: '',
      },
      activeMarkerUUID: null,
    };
  }

  componentDidMount() {
    MapManager.initializeComplete
      .then(() => {
        MapManager.insertMapToDom(document.querySelector('#mapRegion'));
        this.setupMapListeners();
      });
  }

  componentWillUnMount() {
    MapManager.removeAllListeners();
    MapManager.clearPoints();
  }

  plotPoint = ({ lat, lng }) => {
    // de-activate the currently selected marker
    const activeMarker = MapManager.googleMapMarkers[this.state.activeMarkerUUID];
    if ( activeMarker ) {
      activeMarker.setIcon( ICON_PATH );
    }

    // create the marker
    const {
      marker,
      latLngUID,
    } = MapManager.attachMarkerToMap({ lat, lng });

    // activate the created marker
    marker.setIcon( ACTIVE_ICON_PATH );
    this.setState({
      form: {
        lat: lat.toFixed(6).toString(),
        lng: lng.toFixed(6).toString(),
      },
      activeMarkerUUID: latLngUID,
    });
  }

  selectMarker = ({ marker, latLngUID }) => {
    // de-activate the currently selected marker
    const activeMarker = MapManager.googleMapMarkers[this.state.activeMarkerUUID];
    if ( activeMarker ) {
      activeMarker.setIcon( ICON_PATH );
    }

    // activate the selected marker
    marker.setIcon( ACTIVE_ICON_PATH );
    const { lat, lng } = marker.getPosition();
    const _lat = lat();
    const _lng = lng();
    this.setState({
      form: {
        lat: _lat.toFixed(6).toString(),
        lng: _lng.toFixed(6).toString(),
      },
      activeMarkerUUID: latLngUID,
    });
  }

  setupMapListeners = () => {
    // On clicking the map, plot a point
    MapManager.addOnMapClickListener(({ lat, lng }) => {
      this.plotPoint({ lat, lng });
    });
    // On clicking marker, make it selected
    MapManager.addOnMarkerClickListener(({ marker, latLngUID } ) => {
      this.selectMarker({ marker, latLngUID });
    });
  }

  mockSubmit = (event) => {
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div className="nav">
          <div className="navContent">
            <button className="addPlace">
              {'addPlace'}
            </button>
          </div>
        </div>
        <div className="scrollableContentRegionWrap" >
          <div className="contentRegion">
            <div className="leftRegion">

              <div className="leftRegionScrollableContent">
                <form method="post" action="" className="form leftForm" onSubmit={this.mockSubmit} >
                  <div className="form-item">
                    <label htmlFor="label" >Label</label>
                    <input className="small" type="text" name="label" id="label" />
                  </div>
                  <div className="form-item">
                    <div className="row auto gutters">
                      <div className="col">
                        <label htmlFor="latitude" >latitude</label>
                        <input
                          className="small"
                          type="text"
                          name="latitude"
                          id="latitude"
                          value={this.state.form.lat}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="longitude" >longitude</label>
                        <input
                          className="small"
                          type="text"
                          name="longitude"
                          id="longitude"
                          value={this.state.form.lng}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="leftRegionFooter">
                <button className="actionBtn">
                  actionBtn
                </button>
                <span style={{ marginRight: '10px' }} ></span>
                <button className="actionBtn">
                  actionBtn
                </button>
                <span style={{ marginRight: '10px' }} ></span>
                <button className="actionBtn">
                  actionBtn
                </button>
              </div>
            </div>
            <div className="rightRegion" id="mapRegion" >
            </div>
          </div>
          {'Admin - Plot Places'}
        </div>
        <style jsx>{`
          .nav {
            height: ${NAVBAR_HEIGHT}px;
            display: flex;
            align-items: center;

            padding: 0 20px;

            background: #eee;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            border-bottom: solid black 2px;
          }
          .navContent {
            width: ${CONTENT_REGION_WIDTH}px;
            height: 100%;
            margin: auto;
            border: solid red 2px;
            display: flex;
            align-items: center;
          }
          .scrollableContentRegionWrap {
            position: absolute;
            top: ${NAVBAR_HEIGHT}px;
            left: 0;
            right: 0;
            bottom: 0;
          }
          .contentRegion {
            width: ${CONTENT_REGION_WIDTH}px;
            height: 100%;
            margin: auto;
            background: green;
            display: flex;
          }
          .leftRegion {
            width: 50%;
            border-right: solid black 2px;
            position: relative;
          }
          .leftRegionScrollableContent {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: ${NAVBAR_HEIGHT}px;
            border: solid blue 2px;
            overflow: auto;
          }
          .leftRegionFooter {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: ${NAVBAR_HEIGHT}px;
            border: solid black 2px;
            display: flex;
            align-items: center;
          }
          .rightRegion {
            width: 50%;
          }

          .leftForm {
            padding: 20px;
          }
          .form-item {
            margin-bottom: 1rem;
          }
        `}</style>
      </div>
    );
  }
}

export default PlotPlaces;
