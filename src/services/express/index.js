const express = require("express");
const cors = require("cors");

function createExpressApp(apiRoot, routes) {
  const app = express();
  app.use(express.json());
  app.use(apiRoot, routes);
  app.use(cors());
  return app;
}

module.exports = createExpressApp;
