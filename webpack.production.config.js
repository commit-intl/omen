const path = require('path');
const glob = require('glob');
const webpack = require('webpack')
const autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'source-map',
  context: path.join(__dirname, 'test'),
  entry: [
    //'webpack-dev-server/client?http://localhost:3000',
    './index'
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
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
      sourceMap: true,
    })
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
        test: /\.(css|scss)$/,
        use: [
          {loader: 'style'},
          {
            loader: 'css',
            options: {
              modules: true,
              importLoaders: 4,
              localIdentName: '[hash:base64:4]',
              camelCase: true,
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
          {loader: 'sass'},
        ]
      }
    ]
  }
};