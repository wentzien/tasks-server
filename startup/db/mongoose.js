const logger = require("../logger");
const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
    const db = config.get("db.mongoDb.url") + "/" + config.get("db.mongoDb.name");
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    mongoose.connect(db, options)
        .then(() => logger.info(`Connected to ${db}...`));
}