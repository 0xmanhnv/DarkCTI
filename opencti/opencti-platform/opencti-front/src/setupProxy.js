/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

const onError = function(err, req, res) {
  console.log('Something went wrong... Ignoring');
};

module.exports = function(app) {
  app.use(createProxyMiddleware("/graphql", { target: "http://127.0.0.1:4000", ws: true, onError }));
  app.use(createProxyMiddleware("/storage", { target: "http://127.0.0.1:4000", onError }));
  app.use(createProxyMiddleware("/auth/**", { target: "http://127.0.0.1:4000", onError }));
};
