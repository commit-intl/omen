const path = require('path');
const glob = require('glob');
const webpack = require('webpack')
const autoprefixer = require('autoprefixer');

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    hot: true,
    port: 8080
  },
  devtool: 'source-map',
  mode: 'production',
  context: __dirname,
  entry: [
    //'webpack-dev-server/client?http://localhost:3000',
    './example/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
      sourceMap: true,
    })
  ],
  module: {
    rules: [
      {
        test: /\.html/,
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
      {
        test: /\.(css|scss|sass)/,
        use: [
          {loader: 'sass'},
        ],
      }
    ]
  }
};