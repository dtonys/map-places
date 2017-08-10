import next from 'next';
import {
  setupMongoose,
} from 'helpers/mongo';
import {
  startExpressServer,
  createExpressApp,
} from 'helpers/express';
import loadEnv from './loadEnv';


async function bootstrap() {
  loadEnv();
  await setupMongoose('mapplaces');
  const expressApp = await createExpressApp(next);
  const serverListener = await startExpressServer(expressApp);
  console.log(`Server ready on http://localhost:${serverListener.address().port}`);  // eslint-disable-line no-console
}

bootstrap();
