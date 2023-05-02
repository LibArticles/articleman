const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const path = require("path");
const glob = require("glob");

module.exports = {
  entry: glob.sync("./prebundle/assets/**.js").reduce(function (obj, el) {
    obj[path.parse(el).name] = el;
    return obj;
  }, {}),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname + "/dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./prebundle/index.html",
      filename: "index.html",
    }),
    new HtmlInlineScriptPlugin({
      scriptMatchPattern: "bundle.js",
    }),
  ],
};
