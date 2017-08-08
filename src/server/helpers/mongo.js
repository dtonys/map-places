import fs from 'fs';
import path from 'path';

import mongoose from 'mongoose';
import { MongoDBServer } from 'mongomem';


const debug = require('debug')('mp-helpers-mongo');

export async function setupTestMongoose() {
  const db = new mongoose.Mongoose();
  const connectionString = await MongoDBServer.getConnectionString();
  await db.connect(connectionString, {
    useMongoClient: true,
    promiseLibrary: global.Promise,
    config: {
      autoIndex: true,
    },
  });
  for (const name of mongoose.modelNames()) {
    db.model(name, mongoose.model(name).schema);
  }
  return db;
}

export function registerMongooseModels() {
  // Load all models into mongoose
  const modelAndSchemaFiles = fs.readdirSync( path.resolve(__dirname, '../models') );
  modelAndSchemaFiles.forEach((file) => {
    require('../models/' + file); // eslint-disable-line import/no-dynamic-require
  });
}

export function setupMongoose(db_name) {
  debug('setupMongoose');
  mongoose.Promise = global.Promise;

  return new Promise(( resolve, reject ) => {
    const connection = mongoose.connect(`mongodb://localhost/${db_name}`, {
      useMongoClient: true,
      promiseLibrary: global.Promise,
      config: {
        autoIndex: true,
      },
    });
    connection
      .then(resolve)
      .catch(( error ) => {
        reject(error);
      });
  });
}
