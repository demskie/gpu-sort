let path = require("path");

const distConfig = {
  // Change to your "entry-point".
  entry: "./src/index",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.bundle.js"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".frag", ".vert", ".glsl"]
  },

  // https://github.com/webpack-contrib/css-loader/issues/447
  node: { fs: "empty" },

  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
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
  // Change to your "entry-point".
  entry: "./src/tests/index.test.ts",
  output: {
    path: path.resolve(__dirname, "test"),
    filename: "app.bundle.js"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".frag", ".vert", ".glsl"]
  },

  // https://github.com/webpack-contrib/css-loader/issues/447
  node: { fs: "empty" },

  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
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
  // Change to your "entry-point".
  entry: "./src/benchmarks/index.bench.ts",
  output: {
    path: path.resolve(__dirname, "bench"),
    filename: "app.bundle.js"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".frag", ".vert", ".glsl"]
  },

  // https://github.com/webpack-contrib/css-loader/issues/447
  node: { fs: "empty" },

  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
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

module.exports = [distConfig, testConfig, benchConfig];
