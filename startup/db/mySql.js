const logger = require("../logger");
const mysql = require("mysql");
const config = require("config");

let pool;

module.exports = {
    createPool: () => {
        pool = mysql.createPool({
            connectionLimit: config.get("db.mySql.connectionLimit"),
            host: config.get("db.mySql.host"),
            port: config.get("db.mySql.port"),
            database: config.get("db.mySql.database"),
            user: config.get("db.mySql.user"),
            password: config.get("db.mySql.password"),
        });
        return pool;
    },
    getPool: () => {
        return pool;
    }
};
