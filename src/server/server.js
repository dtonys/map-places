import next from 'next';
import {
  setupMongoose,
  registerMongooseModels,
} from 'helpers/mongo';
import {
  startExpressServer,
  createExpressApp,
} from 'helpers/express';
import loadEnv from './loadEnv';


const debug = require('debug')('mp-server');

loadEnv();

debug('Starting server promise chain: ');
Promise.resolve()
  .then(() => {
    registerMongooseModels();
    return setupMongoose();
  })
  .then(() => {
    return createExpressApp( next );
  })
  .then(( expressApp ) => {
    return startExpressServer(expressApp);
  })
  .then(( listener ) => {
    console.log(`> Ready on http://localhost:${listener.address().port}`); // eslint-disable-line no-console
  })
  .catch(( err ) => {
    console.log('Server startup error: '); // eslint-disable-line no-console
    console.log(err); // eslint-disable-line no-console
  });
