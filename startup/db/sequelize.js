const logger = require("../logger");
const {Sequelize} = require("sequelize");
const config = require("config");

let sequelize;

module.exports = {
    initORM: async () => {
        sequelize = new Sequelize(
            config.get("db.mySql.database"),
            config.get("db.mySql.user"),
            config.get("db.mySql.password"),
            {
                host: config.get("db.mySql.host"),
                dialect: "mysql",
                logging: false
            });

        try {
            await sequelize.authenticate();
            logger.info('Connection has been established successfully.');
        } catch (error) {
            logger.info('Unable to connect to the database:', error);
        }

        require("../../models/associations")();
        await sequelize.sync({
            // force: true,
            // alter: true
        });
    },
    getORM: () => {
        return sequelize;
    }
};
