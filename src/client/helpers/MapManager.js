import lodashGet from 'lodash/get';
import {
  appendScriptToHead,
} from 'helpers/domUtils';


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
      appendScriptToHead(`https://maps.googleapis.com/maps/api/js?v=3&key=${GOOGLE_MAPS_API_KEY}&callback=initMap`);
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
      const latLng = event.latLng;
      console.log(`clicked map at ${latLng.lat()} ${latLng.lng()} `); // eslint-disable-line no-console
    });

    // NOTE: Expose for debugging purposes.
    window.googleMap = this.googleMap;
  },

  /** Public methods **/
  initialize: function ({ initialCenterLatLng }) { // eslint-disable-line func-names
    this._createMapDomNode();
    this.initializeComplete = this._loadGoogleMapsScript()
      .then(() => {
        console.log(' _loadGoogleMapsScript finished ');
        this._createGoogleMap( initialCenterLatLng );
      });
  },
  insertMapToDom: async function insertMapToDom( containerDomNode ) {
    await this.initializeComplete;
    containerDomNode.appendChild(this._mapDomNode);
    // NOTE: Trigger a resize to make the map appear
    google.maps.event.trigger(this.googleMap, 'resize'); // eslint-disable-line
    return true;
  },
  attachMarkerToMap: async function attachMarkerToMap({ lat, lng }) {
    await this.initializeComplete;
    const latLngUID = `${lat}_${lng}`;
    if ( this.googleMapMarkers[latLngUID] ) {
      return false;
    }
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.googleMap,
      icon: ICON_PATH,
    });
    marker.addListener('click', () => {
      const latLng = marker.getPosition();
      console.log(`clicked marker at ${latLng} `); // eslint-disable-line no-console
      this.googleMap.setCenter(marker.getPosition());
    });
    this.googleMapMarkers[latLngUID] = marker;
    return true;
  },
};

export default MapManager;
