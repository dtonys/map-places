import path from 'path';

import dotenv from 'dotenv';
import {
  createSessionEncryptor,
} from 'helpers/session';


export default function loadEnv() {
  // Load dotenv
  const envs = dotenv.load({ path: path.resolve(__dirname, '../../.env') });

  // Set global flags to detect server vs client in React components
  Object.assign(global, envs.parsed, {
    __SERVER__: true,
    __CLIENT__: false,
    __DEVELOPMENT__: !(process.env.NODE_ENV === 'production'),
    __TEST__: process.env.NODE_ENV === 'test',
  });
  createSessionEncryptor();
}

