import path from 'path';

import express from 'express';
import favicon from 'serve-favicon';
import next from 'next';
import dotenv from 'dotenv';

import api from 'api';
import pageRoutes from './pageRoutes';

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
});

// Attach to nodejs global object
if ( envs && envs.parsed ) {
  Object.assign( global, globals );
}

import {
  API_PREFIX,
  APP_PORT,
} from 'constants';

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handler = pageRoutes.getRequestHandler(app);

app.prepare()
  .then(() => {
    const server = express();
    server.use(favicon(path.resolve(__dirname, '../../static/favicon.ico')));

    // API server
    server.use(API_PREFIX, api);

    server.get('/hello', (req, res) => {
      return res.send('hello');
    });

    // NextJS handled routes
    server.use(handler);

    // NOTE: Add custom route handling logic here
    // server.get('/a', (req, res) => {
    //   return app.render(req, res, '/b', req.query);
    // });

    server.listen(APP_PORT, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on http://localhost:${APP_PORT}`); // eslint-disable-line no-console
    });
  });
