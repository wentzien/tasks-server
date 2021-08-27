const express = require("express");
require("dotenv").config();
const config = require("config");
const app = express();

const logger = require("./startup/logger");
require("./startup/logging")();
require("./startup/db/sequelize").initORM();
// require("./startup/db/mongoDb").connectToDb();
// require("./startup/db/mySql").createPool();
// require("./startup/db/mongoose")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/config")();
// require("./startup/validation")();

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

module.exports = server;
