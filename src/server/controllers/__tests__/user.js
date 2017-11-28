import mongoose from 'mongoose';


import {
  nextMock,
} from 'helpers/nextMock';
import {
  setupMongoose,
  buildAllIndexes,
} from 'helpers/mongo';
import User from 'models/user';
import {
  createExpressApp,
  startExpressServer,
} from 'helpers/express';
import { createMockWebApiRequest } from 'web-api/webApiRequest';
import loadEnv from '../../loadEnv';


describe('Place API tests', () => {

  // Bootstrap application in test mode
  beforeAll(async (done) => {
    loadEnv();
    await setupMongoose('mapplaces_test');
    const expressApp = await createExpressApp(nextMock);
    const serverListener = await startExpressServer(expressApp);
    console.log(`Server ready on http://localhost:${serverListener.address().port}`); // eslint-disable-line no-console
    done();
  });

  // Clear database state before each test
  // beforeEach('Clear database state before each test', async (done) => {
  //   console.log('Clear database state before each test');
  //   const db = mongoose.connection;
  //   for ( const collectionName of Object.keys(db.collections) ) {
  //     try {
  //       await db.collections[collectionName].drop(); // eslint-disable-line no-await-in-loop
  //     }
  //     catch ( error ) {
  //       // IGNORE_EXCEPTION
  //     }
  //   }
  //   await buildAllIndexes();
  //   done();
  // });

  it('true to be true', () => {
    console.log('true to be true');
    expect(2 + 2).toBe(4);
  });

});
