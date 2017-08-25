import path from 'path';
import repl from 'repl';
import mongoose from 'mongoose';
import * as mongoHelpers from 'helpers/mongo';
import loadEnv from '../src/server/loadEnv';
import * as mailer from 'email/mailer';

// Should only be used in repl to fully reload source code.
function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module); // eslint-disable-line
}

function reloadRepl( replServer ) {
  Promise.resolve()
    .then(() => {
      console.log('Reloading...');
    })
    .then(() => {
      return replServer.context.mongoose.disconnect();
    })
    .then(() => {
      return mongoHelpers.setupMongoose('mapplaces');
    })
    .then(() => {
      // Reload mongo
      replServer.context.mongoose = requireUncached('mongoose');
      replServer.context.mongoHelpers = requireUncached( path.join(__dirname, '../src/server/helpers/mongo') );
      replServer.context.db = replServer.context.mongoose.connection;
      Object.keys(replServer.context.db.models).forEach(( modelName ) => {
        replServer.context[modelName] = replServer.context.db.models[modelName];
      });
      // Reload mailer
      replServer.context.mailer = requireUncached( path.join(__dirname, '../src/server/email/mailer') );
      replServer.context.mailer.initialize();
      replServer.context.reloads++;
    })
    .then(() => {
      console.log('Done.');
    });
}

function startRepl() {
  const db = mongoose.connection;

  // start repl server
  const replServer = repl.start({
    prompt: '[MP] > ',
  });

  // attach models to repl context
  Object.keys(db.models).forEach(( modelName ) => {
    replServer.context[modelName] = db.models[modelName];
  });

  replServer.context.mongoose = mongoose;
  replServer.context.mongoHelpers = mongoHelpers;
  replServer.context.db = db;
  replServer.context.mailer = mailer;
  replServer.context.reload = reloadRepl.bind( null, replServer );
  replServer.context.reloads = 0;
}

async function bootstrap() {
  await mongoHelpers.setupMongoose('mapplaces');
  mailer.initialize();
  startRepl();
}

loadEnv();
bootstrap();
