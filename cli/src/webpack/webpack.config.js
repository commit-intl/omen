const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (executionDir, isProd, build = false) => ({
  mode: isProd ? "production" : "development",
  entry: ["./src/index"],
  output: {
    path: path.resolve(executionDir, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [require.resolve("@babel/preset-env")],
              plugins: [
                [require.resolve("babel-plugin-transform-react-jsx"), { "pragma": "omen.create" }]
              ],
              env: {
                publish: {
                  presets: [
                    [
                      "minify",
                      {
                        mangle: isProd,
                        evaluate: isProd,
                      }
                    ]
                  ]
                }
              }
            }
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
              localIdentName: isProd ? '[hash:base64:8]' : '[path][name]__[local]--[hash:base64:5]'
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
      path.resolve(__dirname, "../../node_modules"),
      path.resolve(executionDir, "src")
    ],
    extensions: [".js", ".json", ".jsx", ".css", ".scss", ".sass"],
    alias: {},
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, "../../node_modules"),
    ],
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
    clientLogLevel: 'warning'
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
});
