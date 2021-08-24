const Joi = require("joi");
const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../startup/db/sequelize").getORM();

const Tasklist = sequelize.define("Tasklist", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
            min: 3,
            max: 50
        }
    }
});

function validateTasklist(task) {
    const schema = Joi.object({
        title: Joi.string()
            .min(3)
            .max(50)
            .required()
    });

    return schema.validate(task);
}

exports.Tasklist = Tasklist;
exports.validateTasklist = validateTasklist;
