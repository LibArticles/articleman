/* eslint-env node */

const crypto = require('crypto');
const path = require('path');

class HashedFilesPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'HashedFilesPlugin',
      (compilation, callback) => {
        compilation.chunks.forEach((chunk) => {
          chunk.files.forEach((filename) => {
            if (filename.endsWith('.css')) {
              const asset = compilation.getAsset(filename);

              if (asset) {
                const content = asset.source.source();
                const hash = crypto
                  .createHash('md5')
                  .update(content)
                  .digest('hex');
                const hashedFilename = `${path.basename(
                  filename,
                  '.css'
                )}.${hash}.css`;

                const newAsset = {
                  source: () => content,
                  size: () => content.length,
                };

                compilation.emitAsset(hashedFilename, newAsset);
              }
            }
          });
        });

        callback();
      }
    );
  }
}

module.exports = HashedFilesPlugin;
