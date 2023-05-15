'use strict';

const config = require('./config.json');

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    babel: {
      // add typescript support
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
  });

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    packagerOptions: {
      publicAssetURL: config.frontendUrl,
      webpackConfig: {
        resolve: {
          alias: {
            casement: 'casement/dist/casement.min.js',
          },
        },
        module: {
          rules: [
            {
              test: /\.scss$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: '[path][name]-[contenthash].[ext]',
                  },
                },
                'extract-loader',
                'css-loader',
                'sass-loader',
              ],
            },
          ],
        },
      },
    },
  });
};
