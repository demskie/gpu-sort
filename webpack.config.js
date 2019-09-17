/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");

const distConfig = {
  name: "dist",
  target: "web",
  mode: "production",
  performance: { hints: false },
  entry: "./lib/index",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "dist.bundle.js"
  },
  externals: [],
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  node: {
    fs: "empty"
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
};

const benchGenerateConfig = {
  name: "bench-generate",
  target: "web",
  mode: "production",
  performance: { hints: false },
  entry: path.resolve(__dirname, "src/benchmarks/generate.bench.ts"),
  output: {
    path: path.resolve(__dirname, "serve-benchmark/public"),
    filename: "generate.bundle.js",
    library: "gpuSortGenerate",
    libraryTarget: "window"
  },
  externals: [],
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  node: {
    fs: "empty"
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
};

module.exports = [distConfig, benchGenerateConfig];
