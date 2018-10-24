const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    hot: true,
    port: 8080
  },
  devtool: 'source-map',
  mode: 'development',
  context: __dirname,
  entry: [
    //'webpack-dev-server/client?http://localhost:3000',
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        use: [
          "style", // creates style nodes from JS strings
          {
            loader: "css",
            options: {
                modules: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            }, // translates CSS into CommonJS
          "sass" // compiles Sass to CSS
        ],
      },
      {
        test: /\.html$/,
        use: [
          {loader: 'html'},
        ],
      },
      {
        test: /\.js$/,
        use: [
          {loader: 'babel'},
        ],
      },
    ]
  },
  resolve: {
    modules: [
      "node_modules",
    ],
  }
};