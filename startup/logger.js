const {createLogger, format, transports} = require('winston');
const {simple} = format;

module.exports = createLogger({
    level: "info",
    format: simple(),
    transports: [
        new transports.File({filename: "./logs/error.log", level: "error"}),
        new transports.File({filename: "./logs/combined.log"}),
        new transports.Console()
    ],
    exceptionHandlers: [
        new transports.File({filename: "./logs/uncaughtExceptions.log"}),
        new transports.Console()
    ]
});