const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const executionDir = process.cwd();

module.exports = {
  mode: "development",
  entry: "./src/index",
  output: {
    path: path.resolve(executionDir, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          plugins: [
            ["transform-react-jsx", { "pragma": "omen.create" }]
          ],
          env: {
            publish: {
              presets: [
                [
                  "minify",
                  {
                    mangle: false,
                    evaluate: false
                  }
                ]
              ]
            }
          }
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {}
          }
        ]
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          },
          {
            loader: "sass-loader",
          },
        ]
      },
    ],
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(executionDir, "app")
    ],
    extensions: [".js", ".json", ".jsx", ".css", ".scss", ".sass"],
    alias: {},
  },
  performance: {
    hints: "warning",
  },
  devtool: "source-map",
  context: executionDir,
  target: "web",
  stats: "errors-only",
  devServer: {
    contentBase: path.join(executionDir, "dist"),
    compress: true,
    historyApiFallback: true,
    hot: true,
    https: false,
    noInfo: true,
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
};