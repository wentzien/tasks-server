const config = require("config");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../startup/db/sequelize").getORM();

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
            min: 3,
            max: 50
        }
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notNull: true,
            notEmpty: true,
            max: 255
        }
    },
    password: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
            min: 5,
            max: 255
        }
    }
});

User.prototype.generateAuthToken = function () {
    const token = jwt.sign(
        {
            id: this.id,
            name: this.name,
            email: this.email,
            // roles: [],
            // operations: []
        },
        config.get("jwtPrivateKey")
    );
    return token;
}

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .required(),
        email: Joi.string()
            .max(255)
            .required()
            .email(),
        password: Joi.string()
            .min(5)
            .max(255)
            .required()
    });

    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
