import webApiRequest from 'web-api/webApiRequest';

export async function loadUserApi() {
  const response = await webApiRequest('GET', '/api/user');
  return response.data;
}

export async function loadPageDataApi() {
  const response = await webApiRequest('GET', '/api/page');
  return response.data;
}
