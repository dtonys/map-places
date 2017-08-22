const localStorageInitialState = {
  places: {},
};

/*
{
  places: {
    <id>: {
      ...placeDetail,
    }
  }
}

*/
export function initializeLocalStorage() {
  if ( !localStorage.getItem('data') ) {
    localStorage.setItem('data', JSON.stringify(localStorageInitialState));
  }
}

// getItem
// setItem
// removeItem
// clear

// Get places list
export async function loadPlacesApi( webApiRequest ) {
  const placesData = await new Promise((resolve /* , reject */) => {
    const data = JSON.parse( localStorage.getItem('data') );
    setTimeout(() => resolve(data.places), 500);
  });
  return placesData;
}

// CRUD Places
export async function createPlaceApi( webApiRequest, payload) {
  const placesData = await new Promise((resolve /* , reject */) => {
    const data = JSON.parse( localStorage.getItem('data') );
    data.places[payload.id] = payload;
    localStorage.setItem('data', JSON.stringify(data));
    setTimeout(() => resolve(payload), 500);
  });
  return placesData;
}

export async function updatePlaceApi( webApiRequest, payload ) {
  const { id } = payload;
  const result = await new Promise((resolve /* , reject */) => {
    const data = JSON.parse( localStorage.getItem('data') );
    data.places[id] = {
      ...data.places[id],
      ...payload,
    };
    localStorage.setItem('data', JSON.stringify(data));
    setTimeout(() => resolve(data.places[id]), 500);
  });
  return result;
}

export async function getPlaceApi( webApiRequest, payload ) {
  const { id } = payload;
  const result = await new Promise((resolve /* , reject */) => {
    const data = JSON.parse( localStorage.getItem('data') );
    setTimeout(() => resolve(data.places[id]), 500);
  });
  return result;
}

export async function deletePlaceApi( webApiRequest, payload ) {
  const { id } = payload;
  const result = await new Promise((resolve /* , reject */) => {
    const data = JSON.parse( localStorage.getItem('data') );
    delete data.places[id];
    localStorage.setItem('data', JSON.stringify(data));
    setTimeout(() => resolve(true), 500);
  });
  return result;
}

