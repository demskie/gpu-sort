/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const nodeExternals = require("webpack-node-externals");
const babelPolyfill = require("babel-polyfill");

const distConfig = {
  name: "dist",
  target: "web",
  mode: "production",
  entry: "./src/index",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "dist.bundle.js"
  },
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(frag|vert|glsl)$/i,
        exclude: /node_modules/,
        loader: "raw-loader"
      }
    ]
  }
};

const libConfig = {
  name: "lib",
  target: "node",
  mode: "production",
  entry: "./src/index",
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "lib.bundle.js"
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(frag|vert|glsl)$/i,
        exclude: /node_modules/,
        loader: "raw-loader"
      }
    ]
  }
};

const benchConfig = {
  name: "bench",
  target: "node",
  mode: "development",
  entry: "./src/benchmarks/index.bench.ts",
  output: {
    path: path.resolve(__dirname, "bench"),
    filename: "bench.bundle.js"
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(frag|vert|glsl)$/i,
        exclude: /node_modules/,
        loader: "raw-loader"
      }
    ]
  }
};

const benchGenerateConfig = {
  name: "bench-generate",
  target: "web",
  mode: "production",
  entry: ["babel-polyfill", path.resolve(__dirname, "src/benchmarks/generate.bench.ts")],
  output: {
    path: path.resolve(__dirname, "serve-benchmark/public"),
    filename: "generate.bundle.js",
    library: "gpuSortGenerate",
    libraryTarget: "window"
	},
	node: {
		fs: "empty"
	},
  externals: [],
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(frag|vert|glsl)$/i,
        exclude: /node_modules/,
        loader: "raw-loader"
      }
    ]
  }
};

const testConfig = {
  name: "test",
  target: "node",
  mode: "development",
  entry: "./src/tests/index.test.ts",
  output: {
    path: path.resolve(__dirname, "test"),
    filename: "test.bundle.js"
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(frag|vert|glsl)$/i,
        exclude: /node_modules/,
        loader: "raw-loader"
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
};

module.exports = [distConfig, libConfig, benchConfig, benchGenerateConfig, testConfig];
