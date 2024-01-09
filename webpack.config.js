// webpack.config.js
module.exports = {
  // ... other configuration ...
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "assert": require.resolve("assert/"),
      "constants": require.resolve("constants-browserify"),
      "buffer": require.resolve("buffer/")
    }
  }
};
