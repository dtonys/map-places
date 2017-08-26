import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import pageRoutes from 'routes/pageRoutes';
import api from 'api';
import { renderEmail } from 'email/mailer';

import {
  APP_PORT,
  TEST_PORT,
} from 'constants';


const debug = require('debug')('mp-helpers-express');

export function startExpressServer(expressApp) {
  debug('startExpressServer');
  const port = __TEST__ ? TEST_PORT : APP_PORT;
  return new Promise(( resolve, reject ) => {
    const listener = expressApp.listen(port, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(listener);
    });
  });
}

export async function createExpressApp( next ) {
  debug('createExpressServer');
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({ dev });
  const handler = pageRoutes.getRequestHandler(app);

  const server = express();
  server.use(favicon(path.resolve(__dirname, '../../../static/favicon.ico')));
  server.use(cookieParser());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  // Session middleware

  server.use('/email/:mailName', renderEmail);

  // API server
  server.use(api);
  // NextJS handled routes
  // NOTE: Add custom route handling logic here
  // server.get('/a', (req, res) => {
  //   return app.render(req, res, '/b', req.query);
  // });
  server.use( handler );
  await app.prepare();

  return server;
}
