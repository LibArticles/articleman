'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const HashedFilesPlugin = require('./HashedFilesPlugin.js');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
  });

  if (app.env === 'production') {
    app.postBuild = function () {
      let hashedFilesPlugin = new HashedFilesPlugin();
      hashedFilesPlugin.apply(this);
    };
  }

  return app.toTree();
};
