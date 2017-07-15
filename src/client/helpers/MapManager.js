import lodashGet from 'lodash/get';
import {
  appendScriptToHead,
} from 'domUtils';

const MapManager = {
  /** Private members **/
  mapDomNode: null,
  googleMap: null,
  googleMapMarkers: {},
  initializeComplete: null,
  createMapDomNode: function () { // eslint-disable-line func-names
    if ( this.mapDomNode ) return;
    this.mapDomNode = document.createElement('div');
    this.mapDomNode.style.cssText = 'height: 100%; width: 100%;';
  },
  loadGoogleMapsScript: function () { // eslint-disable-line func-names
    return new Promise((resolve) => {
      const isGoogleMapsScriptLoaded = Boolean( lodashGet( window, 'google.maps.Map' ) );
      if ( isGoogleMapsScriptLoaded ) {
        resolve();
        return;
      }
      window.initMap = resolve;
      appendScriptToHead(`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`);
    });
  },
  createGoogleMap: function () { // eslint-disable-line func-names
    if ( this.googleMap ) return;
    this.googleMap = new google.maps.Map(this.mapDomNode, { // eslint-disable-line
      center: {
        lat: 37.66,
        lng: -122.47,
      },
      zoom: 11,
    });
  },
  /** Public members **/
  initialize: function () { // eslint-disable-line func-names
    this.createMapDomNode();
    this.initializeComplete = this.loadGoogleMapsScript()
      .then(() => {
        this.createGoogleMap();
      });
  },
  insertMapToDom: async function insertMapToDom( containerDomNode ) {
    await this.initializeComplete;
    containerDomNode.appendChild(this.mapDomNode);
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
    });
    this.googleMapMarkers[latLngUID] = marker;
    return true;
  },
};

export default MapManager;
