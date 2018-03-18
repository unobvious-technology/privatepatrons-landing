var path = require("path");
var webpack = require("webpack");
var nodeExternals = require("webpack-node-externals");

const commonConfig = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  module: {
    rules: [
      {
        oneOf: [
          // TODO: Base on create-react-app's webpack config:
          { test: /\.(js)$/, use: "babel-loader" },
          {
            test: /\.(ts)$/,
            use: ["babel-loader", "ts-loader"]
          },
          {
            test: /\.(graphql|gql)$/,
            exclude: /node_modules/,
            loader: "graphql-tag/loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};

var browserConfig = {
  ...commonConfig,
  entry: ["./src/browser/index.ts"],
  output: {
    path: path.resolve(__dirname, "build", "public"),
    filename: "bundle.js",
    publicPath: "/"
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: "true"
    })
  ]
};

var serverConfig = {
  ...commonConfig,
  entry: ["babel-polyfill", "./src/server/index.ts"],
  target: "node",
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "server.js",
    publicPath: "/"
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: "false"
    })
  ]
};

module.exports = [browserConfig, serverConfig];
