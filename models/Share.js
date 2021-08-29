const Joi = require("joi");
const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../startup/db/sequelize").getORM();

const Share = sequelize.define("Share", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    role: {
        type: DataTypes.ENUM("Editor", "Reader"),
        defaultValue: "Reader"
    },
    status: {
        type: DataTypes.ENUM("Invited", "Accepted", "Declined"),
        defaultValue: "Invited"
    }
});

function validateShare(task) {
    const schema = Joi.object({
        role: Joi.string().valid("Invited", "Accepted", "Declined").allow(""),
        email: Joi.string().email().required()
    });

    return schema.validate(task);
}

exports.Share = Share;
exports.validateShare = validateShare;
