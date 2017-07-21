export const REQUESTED_SUFFIX = '_REQUESTED';
export const STARTED_SUFFIX = '_STARTED';
export const SUCCESS_SUFFIX = '_SUCCESS';
export const ERROR_SUFFIX = '_ERROR';
export const EXECUTED_SUFFIX = '_EXECUTED';

export default function makeAction( type, payload, meta = {} ) {
  return {
    type,
    payload,
    meta,
  };
}

// Send a request to the saga.  Only one may run at a time.
export function request( type ) {
  return `${type}${REQUESTED_SUFFIX}/request`;
}

// Send a request to the saga.  Many can run in parallel.
export function requestFork( type ) {
  return `${type}${REQUESTED_SUFFIX}/requestFork`;
}

// Report an API start
export function apiStart( type ) {
  return `${type}${STARTED_SUFFIX}/apiStart`;
}

// Report an API success
export function apiSuccess( type ) {
  return `${type}${SUCCESS_SUFFIX}/apiSuccess`;
}

// Report an API error
export function apiError( type ) {
  return `${type}${STARTED_SUFFIX}/apiError`;
}

// Report a timeout start
export function timeoutStart( type ) {
  return `${type}${STARTED_SUFFIX}/timeoutStart`;
}

// Report a timeout end
export function timeoutEnd( type ) {
  return `${type}${STARTED_SUFFIX}/timeoutEnd`;
}

// Execute a state change, goes directly to the reducer with no side effects
export function execute( type ) {
  return `${type}${EXECUTED_SUFFIX}/execute`;
}
