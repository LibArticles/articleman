// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const GasPlugin = require("gas-webpack-plugin");

const progressHandler = (percentage, message, ...args) => {
  // e.g. Output each progress message directly to the console:
  console.info(percentage, message, ...args);
};

const isProduction = process.env.NODE_ENV == 'production';

const { ProgressPlugin } = require('webpack');

const backEndConfig = {
  entry: './src/backend/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'articleman-backend.js'
  },
  plugins: [
      new GasPlugin(),
      new ProgressPlugin(progressHandler),
  ],
  module: {
      rules: [
          {
              test: /\.(ts|tsx)$/i,
              loader: 'ts-loader',
              exclude: ['/node_modules/'],
          }
      ],
  },
  devtool: false,
  resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
      extensionAlias: {
        '.js': ['.ts', '.js'],
        '.mjs': ['.mts', '.mjs'],
      },
  },
};


module.exports = () => {
    if (isProduction) {
        backEndConfig.mode = 'production';
    } else {
        backEndConfig.mode = 'development';
    }
    return backEndConfig;
};
