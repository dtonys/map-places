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
export async function setupTestEnvironment(port) {
  const expressApp = await createExpressApp(nextMock);
  _server = await startExpressServer(expressApp, global.testPort);
  console.log(`Server ready on http://localhost:${global.testPort}`); // eslint-disable-line no-console
  const request = createRequest({
    basePath: `http://localhost:${global.testPort}`,
    noFollowRedirects: true,
  });
  return request;
}

export async function teardownTestEnvironment( port ) {
  await mongoose.connection.db.dropDatabase();
  mongoose.connection.close();
  _server.close();
}
