import fs from 'fs';
import path from 'path';

import mongoose from 'mongoose';


const debug = require('debug')('mp-helpers-mongo');

function registerMongooseModels() {
  debug('registerMongooseModels');
  // Load all models into mongoose
  const modelAndSchemaFiles = fs.readdirSync( path.resolve(__dirname, '../models') );
  modelAndSchemaFiles.forEach((file) => {
    require('../models/' + file); // eslint-disable-line import/no-dynamic-require
  });
}

export function reIndexAll() {
  const db = mongoose.connection;
  const collectionNames = Object.keys(db.collections);
  const dropIndexPromises = collectionNames.map(( collectionName ) => {
    return db.collections[collectionName].dropIndexes();
  });
  return Promise.all(dropIndexPromises)
    .then(() => {
      const buildIndexPromises = collectionNames.map(( collectionName ) => {
        return db.collections[collectionName].reIndex();
      });
      return Promise.all(buildIndexPromises);
    })
    .then(() => {
      console.log('reIndexAll done');
    });
}

export function buildAllIndexes() {
  debug('buildAllIndexes');
  const db = mongoose.connection;
  const buildIndexPromises = Object.keys(db.models).map(( model ) => {
    return db.models[model].ensureIndexes();
  });
  return Promise.all(buildIndexPromises);
}

export function setupMongoose(dbName) {
  debug('setupMongoose');
  mongoose.set('debug', true);
  mongoose.Promise = global.Promise;

  registerMongooseModels();

  return new Promise(( resolve, reject ) => {
    const connection = mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}/${dbName}`, {
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
