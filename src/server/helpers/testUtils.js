import mongoose from 'mongoose';

import {
  nextMock,
} from 'helpers/nextMock';
import {
  setupMongoose,
  buildAllIndexes,
} from 'helpers/mongo';
import {
  createExpressApp,
  startExpressServer,
} from 'helpers/express';
import { createMockWebApiRequest } from 'web-api/webApiRequest';
import loadEnv from '../loadEnv';


const portToObject = {};

export async function setupTestEnvironment(port) {
  loadEnv();
  await setupMongoose(`mapplaces_test_${port}`);
  await buildAllIndexes();
  const expressApp = await createExpressApp(nextMock);
  const server = await startExpressServer(expressApp, port);
  console.log(`Server ready on http://localhost:${port}`); // eslint-disable-line no-console
  const webApiRequest = createMockWebApiRequest(port);
  portToObject[port] = {
    server,
  };
  return webApiRequest;
}

export async function teardownTestEnvironment( port ) {
  const { server } = portToObject[port];
  await mongoose.connection.db.dropDatabase();
  mongoose.connection.close();
  server.close();
}
