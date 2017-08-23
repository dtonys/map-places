export async function sessionInfoApi( webApiRequest ) {
  const response = await webApiRequest('GET', '/api/session/info' );
  return response.data;
}

export async function loginApi( webApiRequest, payload ) {
  const response = await webApiRequest(
    'POST', '/api/login', {
      body: payload,
    },
  );
  return response;
}

export async function signupApi( webApiRequest, payload ) {
  const response = await webApiRequest(
    'POST', '/api/signup', {
      body: payload,
    },
  );
  return response;
}

export async function logoutApi( webApiRequest ) {
  const response = await webApiRequest('GET', '/api/logout');
  return response;
}


export async function loadPageDataApi( webApiRequest ) {
  const response = await webApiRequest('GET', '/api/page');
  return response.data;
}

// Get places list
export async function loadPlacesApi( webApiRequest ) {
  const response = await webApiRequest('GET', '/api/places');
  return response.data;
}

// CRUD Places
export async function createPlaceApi( webApiRequest ) {
  const response = await webApiRequest('POST', '/api/places');
  return response.data;
}

export async function updatePlaceApi( webApiRequest, id ) {
  const response = await webApiRequest('PATCH', `/api/places/${id}`);
  return response.data;
}

export async function getPlaceApi( webApiRequest, id ) {
  const response = await webApiRequest('GET', `/api/places/${id}`);
  return response.data;
}

export async function deletePlaceApi( webApiRequest, id ) {
  const response = await webApiRequest('DELETE', `/api/places/${id}`);
  return response.data;
}

