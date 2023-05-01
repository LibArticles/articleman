// write a webpack config file with html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  // The entry point for the bundle
  entry: './src/frontend/index.js',
  // The name of the output file
  output: {
    filename: 'bundle.js',
  },
};
