const {DataTypes} = require("sequelize");
const sequelize = require("../startup/db/sequelize").getORM();

const Tasklist = sequelize.define("Tasklist", {
    id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
});

exports.Tasklist = Tasklist;