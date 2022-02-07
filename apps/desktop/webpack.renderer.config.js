/* eslint-disable global-require */
// eslint-disable-next-line import/no-extraneous-dependencies
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
