'use strict';

const config = require('./config.json');
const path = require('path');

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { Webpack } = require('@embroider/webpack');
const CustomFingerprintPlugin = require('./CustomFingerprintPlugin');
const replace = require('broccoli-replace');

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

  app.registry.add('css', new CustomFingerprintPlugin());

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
      },
    },
    postprocessTree(type, tree) {
      if (type === 'all') {
        const assetMap = require('./dist/assets/assetMap.json'); // Adjust the path to the asset map file if necessary

        return replace(tree, {
          files: ['index.html'],
          patterns: Object.keys(assetMap).map((originalPath) => ({
            match: originalPath,
            replacement: assetMap[originalPath],
          })),
        });
      }
      return tree;
    },
  });
};
