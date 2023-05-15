const AssetRev = require('broccoli-asset-rev');

module.exports = class CustomFingerprintPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  toTree(tree, inputPath, outputPath) {
    return new AssetRev(tree, {
      generateAssetMap: true,
      assetMapPath: outputPath + '/assetMap.json',
      ...this.options,
    });
  }
};
