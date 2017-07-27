// This middleware allows a promise to be returned from the dispatch.
// It can be used where the local promise callback is convenient
// See: https://github.com/redux-saga/redux-saga/issues/697

export const DEFERRED = Symbol('DEFERRED');

const createExposedPromise = () => {
  const deferred = {};

  const promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return [ promise, deferred ];
};

export default store => next => action => {
  if (!action[DEFERRED]) {
    return next(action);
  }

  const [ promise, deferred ] = createExposedPromise();
  next({ ...action, [DEFERRED]: deferred });
  return promise;
};
