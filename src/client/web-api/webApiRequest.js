import superagent from 'superagent';
import lodashGet from 'lodash/get';
import { TEST_PORT } from 'constants';
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR';
export const NETWORK_ERROR = 'NETWORK_ERROR';
export const RESPONSE_BODY_PARSE_FAIL_ERROR = 'RESPONSE_BODY_PARSE_FAIL';
export const HTTP_STATUS_ERROR = 'HTTP_STATUS_ERROR';
export const SERVER_VALIDATION_ERROR = 'SERVER_VALIDATION_ERROR';


export const WEB_API_ERROR_TYPES = [
  UNKNOWN_ERROR,
  NETWORK_ERROR,
  RESPONSE_BODY_PARSE_FAIL_ERROR,
  HTTP_STATUS_ERROR,
];


const debug = require('debug')('mp-webApiRequest');

function maskUnhandledError(error) {
  let maskedError = error;
  if ( !__DEVELOPMENT__ ) {
    if ( error.webApiErrorType !== SERVER_VALIDATION_ERROR ) {
      maskedError = {
        ...error,
        message: 'Internal server error.',
      };
    }
  }
  return maskedError;
}

function webApiHandleError( networkError, response, responseBody ) {
  // No `networkError` or `response`. This should not happen. Report unexpected error.
  if ( !networkError && !response ) {
    const error = {
      webApiErrorType: UNKNOWN_ERROR,
      message: 'Unknown error: Neither `networkError` nor `response` provided',
    };
    return maskUnhandledError(error);
  }
  if ( networkError ) {
    const error = {
      webApiErrorType: NETWORK_ERROR,
      name: networkError.name,
      message: networkError.message,
      stack: networkError.stack,
    };
    return maskUnhandledError(error);
  }
  if ( !responseBody ) {
    let error = {
      webApiErrorType: RESPONSE_BODY_PARSE_FAIL_ERROR,
    };
    if ( response.text ) {
      error = {
        ...error,
        responseText: response.text,
      };
    }
    if ( response.error ) {
      error = {
        ...error,
        name: response.error.name,
        message: response.error.message,
        stack: response.error.stack,
        status: response.error.status,
        responseText: response.error.responseText,
      };
    }
    return maskUnhandledError(error);
  }
  if ( response.status >= 400 ) {
    if ( ( response.status === 422 || response.status === 404 ) &&
      responseBody.error &&
      responseBody.error[0]
    ) {
      // Give the error straight to the redux store
      return {
        webApiErrorType: SERVER_VALIDATION_ERROR,
        ...responseBody.error[0],
      };
    }
    const error = {
      webApiErrorType: HTTP_STATUS_ERROR,
      ...responseBody,
    };
    return maskUnhandledError(error);
  }
  return false;
}

export function createRequest({
  req,
  basePath,
  extendPromise,
}) {
  // get base path
  let requestPathBase = '';
  if ( basePath ) {
    requestPathBase = basePath;
  }
  if ( req ) {
    requestPathBase = `${req.protocol}://${req.get('host')}`;
  }
  // return requester function
  return function apiRequest( method, path, params = {} ) {

    const requestPromise = new Promise((resolve, reject) => {
      const requestPath = requestPathBase + path;
      const request = superagent( method, requestPath );
      // NOTE: Disable error on HTTP 4xx or 5xx. This means:
      // - `networkError` will only be populated if `resonse.text` is falsey
      // - Only one of `networkError` or `response` will be set in the callback, never both.
      request.ok((response) => Boolean(response && response.text) );

      // For server side requests, pass the cookie from the express `req`
      // to our current request's headers
      if ( req && lodashGet(req, 'headers.cookie') ) {
        request.set('cookie', req.headers.cookie);
      }
      if ( params.query ) {
        request.query(params.query);
      }
      if ( params.body ) {
        request.send(params.body);
      }
      request.end(( networkError, response ) => {
        if ( networkError ) {
          reject(networkError);
        }
        resolve(response);
      });
    });
    // Add additional `.then` / `.catch` to continue processing the response
    if ( extendPromise ) {
      extendPromise(requestPromise);
    }
    return requestPromise;
  };
}

function webApiParseBody(response) {
  return new Promise((resolve, reject) => {
    let responseBody = null;
    try {
      responseBody = JSON.parse(response.text);
    }
    catch ( exception ) {
      // IGNORE EXCEPTION
    }
    const error = webApiHandleError( null, response, responseBody );
    if ( error ) {
      reject(error);
      return;
    }
    resolve(responseBody);
  });
}

function webApiParseResponse( requestPromise ) {
  requestPromise
    .then(
      webApiParseBody,
      (networkError) => {
        return Promise.reject( webApiHandleError(networkError, null, null) );
      }
    );
}

export function createWebApiRequest({
  req,
  basePath,
} = {}) {
  return createRequest({
    req,
    basePath,
    extendPromise: webApiParseResponse,
  });
}
