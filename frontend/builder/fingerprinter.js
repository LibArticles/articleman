/* eslint-env node */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

module.exports = {
  name: 'embroider-asset-fingerprinting',

  webpackConfig(env) {
    return {
      plugins: [
        new HashedFilesPlugin({
          // Plugin options
        }),
      ],
    };
  },
};

class HashedFilesPlugin {
  constructor(options) {
    this.options = options;
    this.hashedFilenames = new Set();
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'HashedFilesPlugin',
      (compilation, callback) => {
        const htmlAssetNames = Object.keys(compilation.assets).filter((name) =>
          name.endsWith('.html')
        );

        htmlAssetNames.forEach((assetName) => {
          const asset = compilation.assets[assetName];
          const htmlContent = asset.source().toString();

          const updatedHtmlContent = this.updateFileReferences(
            htmlContent,
            compilation
          );

          compilation.assets[assetName] = {
            source: () => updatedHtmlContent,
            size: () => updatedHtmlContent.length,
          };
        });

        callback();
      }
    );

    compiler.hooks.done.tap('HashedFilesPlugin', () => {
      const hashedFilenamesArray = Array.from(this.hashedFilenames);
      fs.writeFileSync(
        'hashed-filenames.json',
        JSON.stringify(hashedFilenamesArray)
      );
    });

    compiler.hooks.compilation.tap('HashedFilesPlugin', (compilation) => {
      const hashedFilenamesPath = path.resolve('hashed-filenames.json');
      if (fs.existsSync(hashedFilenamesPath)) {
        const hashedFilenamesContent = fs.readFileSync(
          hashedFilenamesPath,
          'utf-8'
        );
        this.hashedFilenames = new Set(JSON.parse(hashedFilenamesContent));
      }
    });
  }

  updateFileReferences(htmlContent, compilation) {
    const scriptRegex =
      /<\s*script\s+[^>]*(src\s*=\s*"[^"]+")[^>]*><\s*\/script\s*>/g;
    const linkRegex = /<\s*link\s+[^>]*(href\s*=\s*"[^"]+")[^>]*>/g;
    let updatedHtmlContent = htmlContent;

    updatedHtmlContent = updatedHtmlContent.replace(
      scriptRegex,
      (match, srcAttr) => {
        const originalPath = srcAttr.match(/src\s*=\s*"([^"]+)"/)[1];
        const assetName = path.basename(originalPath);

        if (!this.isFingerprinted(assetName)) {
          const hashedAssetName = this.getHashedFileName(
            assetName,
            compilation
          );

          if (hashedAssetName) {
            this.hashedFilenames.add(hashedAssetName);

            const updatedPath = originalPath.replace(
              assetName,
              hashedAssetName
            );
            return match.replace(originalPath, updatedPath);
          }
        }

        return match;
      }
    );

    updatedHtmlContent = updatedHtmlContent.replace(
      linkRegex,
      (match, hrefAttr) => {
        const originalPath = hrefAttr.match(/href\s*=\s*"([^"]+)"/)[1];
        const assetName = path.basename(originalPath);

        if (!this.isFingerprinted(assetName)) {
          const hashedAssetName = this.getHashedFileName(
            assetName,
            compilation
          );

          if (hashedAssetName) {
            this.hashedFilenames.add(hashedAssetName);

            const updatedPath = originalPath.replace(
              assetName,
              hashedAssetName
            );
            return match.replace(originalPath, updatedPath);
          }
        }

        return match;
      }
    );

    return updatedHtmlContent;
  }

  isFingerprinted(filename) {
    return this.hashedFilenames.has(filename);
  }

  getHashedFileName(filename, compilation) {
    const asset = compilation.assets[filename];

    if (asset) {
      const fileContent = asset;
      const hash = crypto.createHash('sha1');
      hash.update(fileContent);
      const hashedFileName = `${filename}-${hash.digest('hex')}`;
      return hashedFileName;
    }
  }
}
