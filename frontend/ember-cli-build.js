'use strict';

const config = require('./config.json');

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { Webpack } = require('@embroider/webpack');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    babel: {
      plugins: [
        require.resolve('ember-auto-import/babel-plugin'),
        // require.resolve('@babel/plugin-transform-typescript'),
      ],
    },
    tests: false,
    svgJar: {
      sourceDirs: ['public/images/icons', 'public/images/logos'],
    },
    fingerprint: {
      // fingerprint even in dev mode, so that we can use the fingerprinted
      // filenames in the index.html
      enabled: true,
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg', 'woff2'],
      exclude: ['index.html'],
    },
    sourceMaps: {
      enabled: false,
    },
    sassOptions: {
      extension: 'scss',
      implementation: require('sass'),
    },
  });

  return require('@embroider/compat').compatBuild(app, Webpack, {
    packagerOptions: {
      // if in production mode, use the production API URL, else use the current domain
      publicAssetURL:
        EmberApp.env() === 'production' || process.env.CF_PAGES === 1
          ? config.frontendUrl
          : '/',
      webpackConfig: {
        resolve: {
          extensions: ['.js', '.json', '.ts', '.scss', '.css', '.hbs', '.html'],
        },
      },
    },
    staticAddonTrees: true,
    staticAddonTestSupportTrees: true,
    // add the sass tree to the build
  });
};
