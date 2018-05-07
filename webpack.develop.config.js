const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'source-map',
  context: path.join(__dirname, 'test'),
  entry: [
    //'webpack-dev-server/client?http://localhost:3000',
    './index.js',
  ],
  output: {
    path: path.join(__dirname, 'dist', 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  plugins: [
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        use: [
          {loader: 'babel'}
        ],
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html',
          options: {
            minimize: true
          }
        }],
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {loader: 'style'},
          {
            loader: 'css',
            options: {
              modules: true,
              importLoaders: 4,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              camelCase: 'dashes',
              minimize: true,
            },
          },
          {
            loader: 'postcss',
            options: {
              plugins() {
                return [
                  autoprefixer({browsers: ['last 2 versions']}),
                ];
              },
            },
          },
          {
            loader: 'sass',
            options: {
              data: '@import "styles/variables";',
              includePaths: [
                path.join(__dirname, 'src')
              ]
            },
          },
        ]
      }
    ]
  }
};