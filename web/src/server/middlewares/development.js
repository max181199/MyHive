const {resolve} = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../../../config/webpack.config.dev');
const compiler = webpack(webpackConfig);

const clientBuildPath = resolve(__dirname, '..', '..', '..', 'build-dev', 'client', 'index.html');
const staticPath = resolve(__dirname, '..', '..', '..', 'static');

module.exports = function setup(app) {
  app.use(webpackDevMiddleware(compiler));
  app.use(webpackHotMiddleware(compiler));
  app.use('/static', express.static(staticPath));
  app.get('*', (req, res) => res.sendFile(clientBuildPath));
};
