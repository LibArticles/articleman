'use strict';

const config = require('./config.json');
const path = require('path');

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { Webpack } = require('@embroider/webpack');
const Fingerprinter = require('./builder/fingerprinter.js')

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    babel: {
      plugins: [
        require.resolve('ember-auto-import/babel-plugin'),
        require.resolve('@babel/plugin-transform-typescript'),
      ],
    },
    fingerprint: {
      extensions: [
        'js',
        'css',
        'png',
        'jpg',
        'gif',
        'map',
        'svg',
        'woff',
        'woff2',
        'ttf',
        'eot',
      ],
      prepend: '<base href="/" />',
      exclude: ['index.html'],
    },
    sassOptions: {
      extension: 'scss',
      implementation: require('sass'),
    },
  });

  return require('@embroider/compat').compatBuild(app, Webpack, {
    packagerOptions: {
      publicAssetURL: config.frontendUrl,
      webpackConfig: {
        resolve: {
          alias: {
            casement: path.resolve(
              __dirname,
              'node_modules/casement/dist/casement.min.js'
            ),
          },
        },
        plugins: [
          new Fingerprinter(),
        ]
      },
    },
  });
};
