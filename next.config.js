const lodashPick = require('lodash/pick');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const dotenv = require('dotenv');
const CLIENT_ENVS = require('./src/common/config').CLIENT_ENVS;

// Load dotenv
let envs = null;
try {
  envs = dotenv.load({ path: '.env' });
}
catch (ex) {
  console.error('Failed to read .env file:', ex); // eslint-disable-line no-console
}

// Use `DefinePlugin` to inject client side envs into frontend JS
const clientEnvs = lodashPick(envs.parsed, CLIENT_ENVS);
Object.keys(clientEnvs).forEach(( key ) => {
  clientEnvs[key] = JSON.stringify(clientEnvs[key]);
});

// Set global flags to detect server vs client in React components
const defineGlobals = Object.assign({}, clientEnvs, {
  __CLIENT__: 'true',
  __SERVER__: 'false',
  __DEVELOPMENT__: process.env.NODE_ENV === 'production' ? 'false' : 'true',
  __TEST__: process.env.NODE_ENV === 'test' ? 'true' : 'false',
});

const ANALYZE = process.env.ANALYZE;

module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin(defineGlobals)
    );
    if (ANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true
      }));
    }

    return config;
  },
};
