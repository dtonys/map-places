export function tryGetCurrentPosition( onSuccess, onFail ) {
  // HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      onSuccess({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }, () => {
      onFail();
      console.log('geolocation.getCurrentPosition failed.'); // eslint-disable-line no-console
    });
  }
  else {
    onFail();
    console.log('Browser doesn\'t support Geolocation.'); // eslint-disable-line no-console
  }
}

export function placeHolder() { }
