import path from 'path';

import express from 'express';
import favicon from 'serve-favicon';
import next from 'next';
import dotenv from 'dotenv';

import api from 'api';

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

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();
    server.use(favicon(path.resolve(__dirname, '../../static/favicon.ico')));

    // API server
    server.use('/api', api);

    // NOTE: Add custom route handling logic here
    // server.get('/a', (req, res) => {
    //   return app.render(req, res, '/b', req.query);
    // });

    server.get('/hello', (req, res) => {
      return res.send('hello');
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(8050, (err) => {
      if (err) {
        throw err;
      }
      console.log('> Ready on http://localhost:8050'); // eslint-disable-line no-console
    });
  });
