import path from 'path';
import dotenv from 'dotenv';


function setupMockLocalStorage() {
  // https://github.com/tmpvar/jsdom/issues/1137
  const inMemoryLocalStorage = {};
  window.localStorage = {
    setItem(key, val) {
      inMemoryLocalStorage[key] = val;
    },
    getItem(key) {
      return inMemoryLocalStorage[key];
    },
    removeItem(key) {
      delete inMemoryLocalStorage[key];
    },
  };
}

function loadEnv() {
  // Load dotenv
  const envs = dotenv.load({ path: path.resolve(__dirname, '../../../.env') });
  Object.assign(window, envs.parsed, {
    __SERVER__: false,
    __CLIENT__: true,
    __DEVELOPMENT__: true,
    __TEST__: true,
  });
}

export function setupClientTestEnvironment() {
  loadEnv();
  setupMockLocalStorage();
}

export function teardownClientTestEnvironment() {
  console.log('teardownClientTestEnvironment');
}
