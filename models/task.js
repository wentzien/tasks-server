const {DataTypes} = require("sequelize");
const sequelize = require("../startup/db/sequelize").getORM();

const Task = sequelize.define("Task", {
    id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

exports.Task = Task;