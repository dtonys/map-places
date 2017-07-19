export function tryGetCurrentPosition() {
  return new Promise((resolve, reject) => {
    // HTML5 geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }, () => {
        console.log('geolocation.getCurrentPosition failed.'); // eslint-disable-line no-console
        reject();
      });
    }
    else {
      console.log('Browser doesn\'t support Geolocation.'); // eslint-disable-line no-console
      reject();
    }
  });
}

export function placeHolder() { }
