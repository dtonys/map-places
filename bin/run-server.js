const fs = require('fs');
const path = require('path');

// Initialize babel from config, for nodejs.
const babelConfigPath = path.resolve(__dirname, '../.babelrc');
const babelConfigJson = fs.readFileSync(babelConfigPath);
const babelConfig = JSON.parse( babelConfigJson );
babelConfig.extensions = [ '.js' ];

require('babel-register')(babelConfig);
require('babel-polyfill');
require('../src/server/server');
