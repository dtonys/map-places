import lodashGet from 'lodash/get';
import {
  appendScriptToHead,
} from 'helpers/domUtils';
import uuidv1 from 'uuid/v1';
import lodashFindIndex from 'lodash/findIndex';
import lodashNoOp from 'lodash/noop';


export const BASIC_MAP_TYPE_ROADMAP = 'roadmap';
export const BASIC_MAP_TYPE_SATELLITE = 'satellite';
export const BASIC_MAP_TYPE_HYBRID = 'hybrid';
export const BASIC_MAP_TYPE_TERRAIN = 'terrain';
export const BASIC_MAP_TYPES = [
  BASIC_MAP_TYPE_ROADMAP,
  BASIC_MAP_TYPE_SATELLITE,
  BASIC_MAP_TYPE_HYBRID,
  BASIC_MAP_TYPE_TERRAIN,
];

export function getIsGoogleMapsLoaded() {
  return (
    typeof window !== 'undefined' &&
    Boolean( lodashGet( window, 'google.maps.Map' ) )
  );
}

/*
** Control for displaying google maps UI
** Controls guide:
** https://developers.google.com/maps/documentation/javascript/controls
**
** `ControlPosition` constants:
** https://developers.google.com/maps/documentation/javascript/reference#ControlPosition
*/
const getMapControlOptionsDefault = () => {
  return {
    // mapTypeControl: Map / Satellite toggle
    mapTypeControl: false,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER,
    },
    // zoomControl: + / - toggle
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM,
    },
    // scaleControl: 2KM distance in legend
    scaleControl: false,
    // streetViewControl: enables pegman
    streetViewControl: false,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP,
    },
    // fullscreenControl: allow full screen
    fullscreenControl: false,
  };
};

const ICON_PATH = '/static/pin_w30.svg';

const MapManager = {
  /** Private members **/
  _mapDomNode: null,

  /** Public members **/
  initializeComplete: null,
  googleMap: null,
  googleMapMarkers: {},
  onMapClickListeners: [],
  onMarkerClickListeners: [],

  /** Private methods **/
  _createMapDomNode: function () { // eslint-disable-line func-names
    if ( this._mapDomNode ) return;
    this._mapDomNode = document.createElement('div');
    this._mapDomNode.style.cssText = 'height: 100%; width: 100%;';
  },
  _loadGoogleMapsScript: function () { // eslint-disable-line func-names
    return new Promise((resolve) => {
      const isGoogleMapsScriptLoaded = getIsGoogleMapsLoaded();
      if ( isGoogleMapsScriptLoaded ) {
        resolve();
        return;
      }
      window.initMap = resolve;
      appendScriptToHead(`https://maps.googleapis.com/maps/api/js?v=3&key=${GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=places`);
    });
  },
  _createGoogleMap: function ({ // eslint-disable-line func-names
    lat,
    lng,
    mapTypeId = BASIC_MAP_TYPE_ROADMAP,
  }) { // eslint-disable-line func-names
    if ( this.googleMap ) return;
    this.googleMap = new google.maps.Map(this._mapDomNode, { // eslint-disable-line
      center: { lat, lng },
      zoom: 10,
      mapTypeId,
      ...getMapControlOptionsDefault(),
    });
    this.googleMap.addListener('click', (event) => {
      const clickedLat = event.latLng.lat();
      const clickedLng = event.latLng.lng();

      console.log(`clicked map at ${clickedLat} ${clickedLng} `); // eslint-disable-line no-console
      this.onMapClickListeners.forEach((fnObj) => {
        fnObj.onClickFn({
          lat: clickedLat,
          lng: clickedLng,
        });
      });
    });

    // NOTE: Expose for debugging purposes.
    window.googleMap = this.googleMap;
  },

  /** Public methods **/
  initialize: function ({ initialCenterLatLng }) { // eslint-disable-line func-names
    this._createMapDomNode();
    this.initializeComplete = this._loadGoogleMapsScript()
      .then(() => {
        this._createGoogleMap( initialCenterLatLng );
      });
  },

  insertMapToDom: function insertMapToDom( containerDomNode ) {
    containerDomNode.appendChild(this._mapDomNode);
    // NOTE: Trigger a resize to make the map appear
    google.maps.event.trigger(this.googleMap, 'resize'); // eslint-disable-line
    return true;
  },
  attachMarkerToMap: function attachMarkerToMap({ lat, lng }) {
    const latLngUID = `${lat}_${lng}`;
    if ( this.googleMapMarkers[latLngUID] ) {
      return lodashNoOp;
    }
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.googleMap,
      icon: ICON_PATH,
    });
    marker.addListener('click', () => {
      const latLngFns = marker.getPosition();
      const clickedLat = latLngFns.lat();
      const clickedLng = latLngFns.lng();
      console.log(`clicked marker at ${clickedLat}, ${clickedLng} `); // eslint-disable-line no-console
      this.onMarkerClickListeners.forEach((fnObj) => {
        fnObj.onClickFn({
          marker,
          latLngUID,
        });
      });
    });
    this.googleMapMarkers[latLngUID] = marker;
    return {
      marker,
      latLngUID,
    };
  },
  removeMarkerFromMap: function (latLngUID) { // eslint-disable-line func-names
    const marker = this.googleMapMarkers[latLngUID];
    if ( !marker ) {
      return;
    }
    this.googleMapMarkers[latLngUID].setMap(null);
    delete this.googleMapMarkers[latLngUID];
  },
  addOnMapClickListener: function ( onClickFn ) { // eslint-disable-line func-names
    const fnId = uuidv1();
    this.onMapClickListeners.push({
      id: fnId,
      onClickFn,
    });
    // return onRemove
    return function removeMapClickListener() {
      const index = lodashFindIndex( this.onMapClickListeners, { id: fnId });
      if ( index !== -1 ) {
        const removedFn = this.onMapClickListeners.splice(index, 1);
        return removedFn;
      }
      return lodashNoOp;
    };
  },
  addOnMarkerClickListener: function (onClickFn) { // eslint-disable-line func-names
    const fnId = uuidv1();
    this.onMarkerClickListeners.push({
      id: fnId,
      onClickFn,
    });
    // return onRemove
    return function removeMarkerClickListener() {
      const index = lodashFindIndex( this.onMarkerClickListeners, { id: fnId });
      if ( index !== -1 ) {
        const removedFn = this.onMarkerClickListeners.splice(index, 1);
        return removedFn;
      }
      return lodashNoOp;
    };
  },

  resetMap: function () { // eslint-disable-line func-names
    this.deleteAllMarkers();
    this.removeAllListeners();
  },

  deleteAllMarkers: function () { // eslint-disable-line func-names
    this.googleMapMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    this.googleMapMarkers = [];
  },

  removeAllListeners: function () { // eslint-disable-line func-names
    this.onMapClickListeners = [];
    this.onMarkerClickListeners = [];
  },
};

export default MapManager;
