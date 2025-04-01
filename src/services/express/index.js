const express = require("express");

function createExpressApp(apiRoot, routes) {
  const app = express();
  app.use(express.json());
  app.use(apiRoot, routes);
  return app;
}

module.exports = createExpressApp;
