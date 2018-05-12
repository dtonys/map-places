import getPort from 'get-port';
import {
  setupMongoose,
  buildAllIndexes,
} from 'helpers/mongo';
import loadEnv from 'loadEnv';
import * as mailer from 'email/mailer';
import mongoose from 'mongoose';
import {
  nextMock,
} from 'helpers/nextMock';
import {
  createExpressApp,
  startExpressServer,
} from 'helpers/express';
import {
  createRequest,
} from 'web-api/webApiRequest';


let _server = null;
export async function setupTestEnvironment() {
  const port = await getPort();
  loadEnv();
  await setupMongoose(`mapplaces_test_${port}`);
  await buildAllIndexes();
  mailer.initialize();

  const expressApp = await createExpressApp(nextMock);
  _server = await startExpressServer(expressApp, port);
  console.log(`Server ready on http://localhost:${port}`); // eslint-disable-line no-console
  const request = createRequest({
    basePath: `http://localhost:${port}`,
    noFollowRedirects: true,
  });
  return request;
}

export async function teardownTestEnvironment() {
  await mongoose.connection.db.dropDatabase();
  mongoose.connection.close();
  _server.close();
}
