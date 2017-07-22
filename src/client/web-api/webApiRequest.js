import superagent from 'superagent';

export const UNKNOWN_ERROR = 'UNKNOWN_ERROR';
export const NETWORK_ERROR = 'NETWORK_ERROR';
export const RESPONSE_BODY_PARSE_FAIL_ERROR = 'RESPONSE_BODY_PARSE_FAIL';
export const HTTP_STATUS_ERROR = 'HTTP_STATUS_ERROR';

export const WEB_API_ERROR_TYPES = [
  UNKNOWN_ERROR,
  NETWORK_ERROR,
  RESPONSE_BODY_PARSE_FAIL_ERROR,
  HTTP_STATUS_ERROR,
];


function webApiHandleError( networkError, response, responseBody ) {
  // No `networkError` or `response`. This should not happen. Report unexpected error.
  if ( !networkError && !response ) {
    const error = {
      webApiErrorType: UNKNOWN_ERROR,
      message: 'Unknown error: Neither `networkError` nor `response` provided',
    };
    return error;
  }
  if ( networkError ) {
    const error = {
      webApiErrorType: NETWORK_ERROR,
      name: networkError.name,
      message: networkError.message,
      stack: networkError.stack,
    };
    return error;
  }
  if ( !responseBody ) {
    let error = {
      webApiErrorType: RESPONSE_BODY_PARSE_FAIL_ERROR,
    };
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
    return error;
  }
  if ( response.status >= 400 ) {
    const error = {
      webApiErrorType: HTTP_STATUS_ERROR,
      ...responseBody,
    };
    return error;
  }
  return false;
}

export default function webApiRequest( method, path, params) {
  return new Promise(( resolve, reject ) => {
    const request = superagent( method, path);
    // NOTE: Disable error on HTTP 4xx or 5xx. This means:
    // - `networkError` will only be populated if `resonse.text` is falsey
    // - Only one of `networkError` or `response` will be set in the callback, never both.
    request.ok((response) => Boolean(response && response.text) );

    if ( params && params.query ) {
      request.query(params.query);
    }
    if ( params && params.body ) {
      request.send(params.body);
    }

    request.end(( networkError, response ) => {
      if ( !response ) {
        const error = webApiHandleError(networkError, null, null);
        reject( error );
        return;
      }
      // Parse response text to JS object.  Relying on superagent's `request.body` can be error prone,
      // it may return `null` or `{}` on a failed body parse.
      let responseBody = null;
      try {
        responseBody = JSON.parse(response.text);
      }
      catch ( exception ) {
        // IGNORE EXCEPTION
      }
      const error = webApiHandleError( networkError, response, responseBody );
      if ( error ) {
        reject( error );
        return;
      }
      resolve( responseBody );
    });
  });
}
