const state = {};

const clientStore = {
  getState: () => state,
  get: (key) => state[key],
  set: (key, val) => { state[key] = val; },
};

export default clientStore;
