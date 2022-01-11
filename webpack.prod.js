const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

const prod = {
  mode: 'production',
};

module.exports = merge(common, prod);
