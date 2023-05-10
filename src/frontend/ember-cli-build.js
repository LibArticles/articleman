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
  });

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    packagerOptions: {
      publicAssetURL: config.frontendUrl,
    },
  });
  // return app.toTree();
};
