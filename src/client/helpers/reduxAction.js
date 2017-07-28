export default function makeAction( type, payload, meta = {} ) {
  return {
    type,
    payload,
    meta,
  };
}

// Send a request to the saga.  Only one may run at a time.
export function request( type ) {
  return `${type}/request`;
}

// Send a request to the saga.  Many can run in parallel.
export function requestFork( type ) {
  return `${type}/requestFork`;
}

// Report an API start
export function apiStart( type ) {
  return `${type}/apiStart`;
}

// Report an API success
export function apiSuccess( type ) {
  return `${type}/apiSuccess`;
}

// Report an API error
export function apiError( type ) {
  return `${type}/apiError`;
}

// Report an API start
export function localStorageStart( type ) {
  return `${type}/localStorageStart`;
}

// Report an API success
export function localStorageSuccess( type ) {
  return `${type}/localStorageSuccess`;
}

// Report an API error
export function localStorageError( type ) {
  return `${type}/localStorageError`;
}

// Report a timeout start
export function timeoutStart( type ) {
  return `${type}/timeoutStart`;
}

// Report a timeout end
export function timeoutEnd( type ) {
  return `${type}/timeoutEnd`;
}

// Execute a state change, goes directly to the reducer with no side effects
export function execute( type ) {
  return `${type}/execute`;
}

