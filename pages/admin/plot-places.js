import { Component } from 'react';
import clientEntry from 'helpers/clientEntry';
import attachRedux from 'helpers/attachRedux';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

import MapManager, {
  getIsGoogleMapsLoaded,
} from 'helpers/MapManager';

import {
  NAVBAR_HEIGHT,
} from 'constants';

const CONTENT_REGION_WIDTH = 960;
const ICON_PATH = '/static/pin_w30.svg';
const ACTIVE_ICON_PATH = '/static/pin_w30_active.svg';
const GREYED_ICON_PATH = '/static/pin_w30_greyed.svg';


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
        label: '',
      },
      activeMarkerUUID: null,
      activeMarkerSaved: false,
      autoCompleteAddress: '',
      autoCompleteSelected: false,
    };
  }

  componentDidMount() {
    MapManager.initializeComplete
      .then(() => {
        MapManager.insertMapToDom(document.querySelector('#mapRegion'));
        this.setupMapListeners();
        this.setState({
          mapLoaded: true,
        });
      });
  }

  componentWillUnMount() {
    MapManager.removeAllListeners();
    MapManager.clearPoints();
  }

  plotPoint = ({ lat, lng, addressText }) => {
    // check for existing marker
    const existingMarker = MapManager.googleMapMarkers[`${lat}_${lng}`];
    if ( existingMarker ) {
      return;
    }

    // de-activate the currently selected marker
    const activeMarker = MapManager.googleMapMarkers[this.state.activeMarkerUUID];
    if ( activeMarker ) {
      activeMarker.setIcon(
        activeMarker.MP_saved
          ? ICON_PATH
          : GREYED_ICON_PATH
      );
    }

    // create the marker
    const {
      marker,
      latLngUID,
    } = MapManager.attachMarkerToMap({ lat, lng });

    // activate the created marker
    marker.setIcon( ACTIVE_ICON_PATH );
    marker.MP_saved = false;
    this.setState({
      form: {
        ...this.state.form,
        lat: lat.toFixed(6).toString(),
        lng: lng.toFixed(6).toString(),
        label: addressText || this.state.label,
      },
      activeMarkerUUID: latLngUID,
    });
  }

  selectMarker = ({ marker, latLngUID }) => {
    // de-activate the currently selected marker
    const activeMarker = MapManager.googleMapMarkers[this.state.activeMarkerUUID];
    if ( activeMarker ) {
      activeMarker.setIcon(
        activeMarker.MP_saved
          ? ICON_PATH
          : GREYED_ICON_PATH
      );
    }

    // activate the selected marker
    marker.setIcon( ACTIVE_ICON_PATH );
    const { lat, lng } = marker.getPosition();
    const _lat = lat();
    const _lng = lng();
    this.setState({
      form: {
        ...this.state.form,
        lat: _lat.toFixed(6).toString(),
        lng: _lng.toFixed(6).toString(),
      },
      activeMarkerUUID: latLngUID,
      activeMarkerSaved: marker.MP_saved,
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

  deletePlace = () => {
    MapManager.removeMarkerFromMap(this.state.activeMarkerUUID);
    this.setState({
      form: {
        ...this.state.form,
        lat: '',
        lng: '',
        label: '',
      },
      activeMarkerUUID: null,
    });
  }

  savePlace = () => {
    const activeMarker = MapManager.googleMapMarkers[this.state.activeMarkerUUID];
    activeMarker.MP_saved = true;
    activeMarker.setIcon( ICON_PATH );
    this.setState({
      activeMarkerSaved: true,
    });
  }

  deactivatePlace = () => {
    const activeMarker = MapManager.googleMapMarkers[this.state.activeMarkerUUID];
    activeMarker.MP_saved = false;
    activeMarker.setIcon( GREYED_ICON_PATH );
  }

  onAutoCompleteChange = ( address ) => {
    this.setState({
      autoCompleteAddress: address,
      autoCompleteSelected: false,
    });
  }

  onAutoCompleteSelect = (address /* , placeId */) => {
    this.setState({
      autoCompleteAddress: address,
      autoCompleteSelected: true,
    });
  }

  clearAutoCompleteAddress = () => {
    this.setState({
      autoCompleteAddress: '',
      autoCompleteSelected: false,
    });
  }

  plotSearchedPoint = () => {
    geocodeByAddress(this.state.autoCompleteAddress)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        this.plotPoint({ lat, lng, addressText: this.state.autoCompleteAddress });
      })
      .catch((error) => {
        console.error('Error', error);
      });
  }

  render() {
    const {
      activeMarkerUUID,
      activeMarkerSaved,
      autoCompleteAddress,
      autoCompleteSelected,
      mapLoaded,
    } = this.state;

    const autoCompleteInputProps = {
      value: autoCompleteAddress,
      onChange: this.onAutoCompleteChange,
    };

    const autoCompleteStyles = {
      input: {
        paddingRight: '25px',
      },
    };

    return (
      <div>
        <div className="nav">
          <div className="navContent">
            { mapLoaded &&
              <div className="navContentRight" >

                <div
                  className="autoCompleteWrap"
                  style={{
                    width: '80%',
                    position: 'relative',
                  }}
                >
                  <PlacesAutocomplete
                    inputProps={autoCompleteInputProps}
                    onSelect={this.onAutoCompleteSelect}
                    styles={autoCompleteStyles}
                  />
                  { Boolean(autoCompleteAddress) &&
                    <div
                      className="autoCompleteX"
                      onClick={this.clearAutoCompleteAddress}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '10px',
                        cursor: 'pointer',
                      }}
                    >{'X'}</div>
                  }
                </div>
                <div style={{ marginRight: '10px' }}></div>
                <button
                  onClick={ this.plotSearchedPoint }
                  style={{ flex: 1 }}
                  className="button secondary"
                  disabled={!autoCompleteSelected}
                >
                  {'Go'}
                </button>
              </div>
            }
          </div>
        </div>
        <div className="scrollableContentRegionWrap" >
          <div className="contentRegion">
            <div className="leftRegion">

              <div className="leftRegionScrollableContent">
                <form method="post" action="" className="form leftForm" onSubmit={this.mockSubmit} >
                  <div className="form-item">
                    <label htmlFor="label" >Label</label>
                    <input
                      className="small"
                      type="text"
                      name="label"
                      id="label"
                      value={this.state.form.label}
                    />
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
              { activeMarkerUUID &&
                <div className="leftRegionFooter">
                  { !activeMarkerSaved &&
                    <button className="actionBtn" onClick={ this.deletePlace } >
                      {'delete'}
                    </button>
                  }
                  <span style={{ marginRight: '10px' }} ></span>
                  <button className="actionBtn" onClick={ this.savePlace } >
                    {'save'}
                  </button>
                  { activeMarkerSaved &&
                    <div>
                      <span style={{ marginRight: '10px' }} ></span>
                      <button className="actionBtn" onClick={ this.deactivatePlace } >
                        {'deactivate'}
                      </button>
                    </div>
                  }
                  <span style={{ marginRight: '10px' }} ></span>
                </div>
              }
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
            z-index: 2;
          }
          .navContent {
            width: ${CONTENT_REGION_WIDTH}px;
            height: 100%;
            margin: auto;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
          .navContentRight {
            width: 50%;
            display: flex;
            padding: 0 10px;
          }
          .scrollableContentRegionWrap {
            position: absolute;
            top: ${NAVBAR_HEIGHT}px;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
          }
          .contentRegion {
            width: ${CONTENT_REGION_WIDTH}px;
            height: 100%;
            margin: auto;
            display: flex;
          }
          .leftRegion {
            width: 50%;
            border-right: solid black 2px;
            position: relative;
            border-left: solid black 2px;
          }
          .leftRegionScrollableContent {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: ${NAVBAR_HEIGHT}px;
            overflow: auto;
          }
          .leftRegionFooter {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: ${NAVBAR_HEIGHT}px;
            border-top: solid black 2px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
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
