import webApiRequest from 'web-api/webApiRequest';

export async function loadUserApi() {
  const response = await webApiRequest('GET', '/api/user');
  return response.data;
}

export async function loginApi( payload ) {
  const response = await webApiRequest(
    'POST', '/api/login', {
      body: payload,
    }
  );
  return response;
}

export async function signupApi( payload ) {
  const response = await webApiRequest(
    'POST', '/api/signup', {
      body: payload,
    }
  );
  return response;
}


export async function loadPageDataApi() {
  const response = await webApiRequest('GET', '/api/page');
  return response.data;
}

// Get places list
export async function loadPlacesApi() {
  const response = await webApiRequest('GET', '/api/places');
  return response.data;
}

// CRUD Places
export async function createPlaceApi() {
  const response = await webApiRequest('POST', '/api/places');
  return response.data;
}

export async function updatePlaceApi( id ) {
  const response = await webApiRequest('PATCH', '/api/places/ ' + id);
  return response.data;
}

export async function getPlaceApi( id ) {
  const response = await webApiRequest('GET', '/api/places/' + id);
  return response.data;
}

export async function deletePlaceApi( id ) {
  const response = await webApiRequest('DELETE', '/api/places/' + id);
  return response.data;
}

