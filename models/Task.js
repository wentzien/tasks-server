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
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
            max: 127
        }
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: "",
        validate: {
            max: 255
        }
    },
    notes: {
        type: DataTypes.STRING,
        defaultValue: "",
        validate: {
            max: 1023
        }
    },
    dueAt: {
        type: DataTypes.DATE
    },
    done: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    doneAt: {
      type: DataTypes.DATE
    },
    important: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    today: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    }
});

function validateTask(task) {
    const schema = Joi.object({
        title: Joi.string().max(127).required(),
        description: Joi.string().max(255).allow(""),
        notes: Joi.string().max(1023).allow(""),
        dueAt: Joi.date(),
        done: Joi.boolean(),
        doneAt: Joi.date(),
        important: Joi.boolean(),
        today: Joi.boolean()
    });

    return schema.validate(task);
}

exports.Task = Task;
exports.validateTask = validateTask;
