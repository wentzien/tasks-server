const Joi = require("joi");
const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../startup/db/sequelize").getORM();

const Collaborator = sequelize.define("Collaborator", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    role: {
        type: DataTypes.ENUM("Creator", "Editor", "Reader"),
        defaultValue: "Reader"
    },
    status: {
        type: DataTypes.ENUM("Invited", "Accepted", "Declined", "Owner"),
        defaultValue: "Invited"
    }
});

function validateCollaborator(task) {
    const schema = Joi.object({
        role: Joi.string().valid("Invited", "Accepted", "Declined").allow(""),
        email: Joi.string().email().required()
    });

    return schema.validate(task);
}

exports.Collaborator = Collaborator;
exports.validateCollaborator = validateCollaborator;
