import path from 'path';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';

import pageRoutes from 'routes/pageRoutes';
import api from 'api';
import { renderEmail } from 'email/mailer';
import createWebApiRequest from 'web-api/webApiRequest';
import {
  createAuthMiddleware,
} from 'helpers/session';

import {
  USER_ROLE_ADMIN,
} from 'models/user';


const debug = require('debug')('mp-helpers-express');

export function startExpressServer(expressApp, port = '3000') {
  debug('startExpressServer');
  return new Promise(( resolve, reject ) => {
    let listener = null;
    listener = expressApp.listen(port, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(listener);
    });
  });
}

export async function createExpressApp( nextJS ) {
  debug('createExpressServer');
  const dev = process.env.NODE_ENV !== 'production';
  const app = nextJS({ dev });
  const handler = pageRoutes.getRequestHandler(app);

  const server = express();

  // Give admin app access to APIs
  const corsOptions = {
    origin: process.env.ADMIN_PATH,
    credentials: true,
    allowedHeaders: [ 'Content-Range', 'content-type', 'Cookie' ],
    exposedHeaders: [ 'Content-Range', 'content-type', 'Cookie' ],
  };
  server.options('*', cors(corsOptions));
  server.use(cors(corsOptions));

  server.use(favicon(path.resolve(__dirname, '../../../static/favicon.ico')));
  server.use(cookieParser());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  server.use(( req, res, next ) => {
    res.locals.webApiRequest = createWebApiRequest(req);
    next();
  });

  const adminOrRedirect = createAuthMiddleware({
    requiredRoles: [ USER_ROLE_ADMIN ],
    redirect: true,
  });

  // redirect `/admin` to admin hosted app
  // TODO: Authentication for admin role, else redirect to login
  server.get('/admin', adminOrRedirect, async (req, res) => {
    res.redirect(process.env.ADMIN_PATH);
  });

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
