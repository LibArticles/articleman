// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GasPlugin = require("gas-webpack-plugin");
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

const progressHandler = (percentage, message, ...args) => {
  // e.g. Output each progress message directly to the console:
  console.info(percentage, message, ...args);
};

const isProduction = process.env.NODE_ENV == 'production';

const { ProgressPlugin } = require('webpack');



const frontEndConfig = {
    entry: './src/frontend/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'articleman-client.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/frontend/pages/index.hbs',
            inject: "body",
        }),
        new HtmlInlineScriptPlugin({
          scriptMatchPattern: [/articleman-client.js/],
        }),
        new ProgressPlugin(progressHandler),
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            { // handlebars files used on the client side that webpack shouldn't template for us
                test: /\.dry\.hbs$/i,
                type: 'asset/source',
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
            {
                test: /(?<!\.dry)\.hbs/i,
                loader: 'handlebars-loader',
            }

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js',
            "raw.hbs.d.ts": false,
        }
    }
};

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
  resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },
};


module.exports = () => {
    if (isProduction) {
        frontEndConfig.mode = 'production';
        backEndConfig.mode = 'production';
    } else {
        frontEndConfig.mode = 'development';
        backEndConfig.mode = 'development';
    }
    return [frontEndConfig, backEndConfig];
};
