import repl from 'repl';
import mongoose from 'mongoose';
import {
  setupMongoose,
} from 'helpers/mongo';
import loadEnv from '../src/server/loadEnv';

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
  replServer.context.db = db;
}

async function bootstrap() {
  await setupMongoose('mapplaces');
  startRepl();
}

loadEnv();
bootstrap();
