import repl from 'repl';
import mongoose from 'mongoose';
import * as mongoHelpers from 'helpers/mongo';
import loadEnv from '../src/server/loadEnv';
import * as mailer from 'email/mailer';


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
}

async function bootstrap() {
  await mongoHelpers.setupMongoose('mapplaces');
  mailer.initialize();
  startRepl();
}

loadEnv();
bootstrap();
