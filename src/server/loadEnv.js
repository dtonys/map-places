import path from 'path';

import dotenv from 'dotenv';
import {
  createSessionEncryptor,
} from 'helpers/session';


export default function loadEnv() {
  // Load dotenv
  let envs = null;
  try {
    envs = dotenv.load({ path: path.resolve(__dirname, '../../.env') });
  }
  catch (ex) {
    console.error('Failed to read .env file:', ex); // eslint-disable-line no-console
  }

  // Set global flags to detect server vs client in React components
  const globals = Object.assign({}, envs.parsed, {
    __SERVER__: true,
    __CLIENT__: false,
    __DEVELOPMENT__: !(process.env.NODE_ENV === 'production'),
    __TEST__: process.env.NODE_ENV === 'test',
  });

  createSessionEncryptor();

  // Attach to nodejs global object
  if ( envs && envs.parsed ) {
    Object.assign( global, globals );
  }
}

