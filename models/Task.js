const Joi = require("joi");
const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../startup/db/sequelize").getORM();

const Task = sequelize.define("Task", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
            min: 3,
            max: 255
        }
    },
    done: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    important: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    }
});

function validateTask(task) {
    const schema = Joi.object({
        description: Joi.string()
            .min(3)
            .max(255)
            .required(),
        done: Joi.boolean(),
        important: Joi.boolean()
    });

    return schema.validate(task);
}

exports.Task = Task;
exports.validateTask = validateTask;
