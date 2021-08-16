require('dotenv').config();
const config = require("config");
module.exports = {
    "development": {
        "username": config.get("db.mySql.user"),
        "password": config.get("db.mySql.password"),
        "database": config.get("db.mySql.database"),
        "host": config.get("db.mySql.host"),
        "dialect": "mysql"
    },
    // "test": {
    //     "username": "root",
    //     "password": null,
    //     "database": "database_test",
    //     "host": "127.0.0.1",
    //     "dialect": "mysql"
    // },
    "production": {
        "username": config.get("db.mySql.user"),
        "password": config.get("db.mySql.password"),
        "database": config.get("db.mySql.database"),
        "host": config.get("db.mySql.host"),
        "dialect": "mysql"
    }
};
