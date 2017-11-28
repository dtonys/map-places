import next from 'next';
import {
  setupMongoose,
} from 'helpers/mongo';
import {
  startExpressServer,
  createExpressApp,
} from 'helpers/express';
import loadEnv from './loadEnv';
import * as mailer from 'email/mailer';
import {
  APP_PORT,
} from 'constants';

async function bootstrap() {
  loadEnv();
  await setupMongoose('mapplaces');
  mailer.initialize();
  const expressApp = await createExpressApp(next);
  const serverListener = await startExpressServer(expressApp, APP_PORT);
  console.log(`Server ready on http://localhost:${serverListener.address().port}`); // eslint-disable-line no-console
}

bootstrap();
