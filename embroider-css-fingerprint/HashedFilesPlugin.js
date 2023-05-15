const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class HashedFilesPlugin {
  apply(compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {
      const outputPath = compilation.options.output.path;
      const assets = compilation.assets;
      const filenames = Object.keys(assets);

      filenames.forEach((filename) => {
        if (filename.endsWith('.css') && !filename.includes('.')) {
          const asset = assets[filename];
          const content = asset.source();
          const hash = crypto.createHash('md5').update(content).digest('hex');
          const hashedFilename = `${path.basename(filename, '.css')}.${hash}.css`;
          const hashedFilePath = path.join(outputPath, hashedFilename);

          fs.writeFileSync(hashedFilePath, content);
        }
      });

      callback();
    });
  }
}

module.exports = HashedFilesPlugin;
