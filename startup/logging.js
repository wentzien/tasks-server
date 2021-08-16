const {transports} = require('winston');
const logger = require("./logger");
require("express-async-errors"); // wraps code in try and catch blocks

module.exports = function () {

    // uncaught exceptions & unhandled rejections -> terminate process (process can be in an unclean state)

    // uncaught exceptions
    // logger.exceptions.handle(
    //     new transports.Console(),
    //     new transports.File({filename: "./logs/uncaughtExceptions.log"}));

    // unhandled rejections
    process.on("unhandledRejection", (ex) => {
        throw ex; // -> throw uncaught exception, so winston can catch that
    });
}