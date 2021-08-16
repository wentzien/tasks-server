const express = require("express");
const user = require("../routes/users");
const task = require("../routes/tasks");
const auth = require("../routes/auth");
// const galleries = require("../routes/galleries");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/users", user);
  app.use("/api/tasks", task);
  app.use("/api/auth", auth);
  // app.use("/api/galleries", galleries);
  app.use(error);
}