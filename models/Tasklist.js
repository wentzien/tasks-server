const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../startup/db/sequelize").getORM();

const Tasklist = sequelize.define("Tasklist", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
});

exports.Tasklist = Tasklist;