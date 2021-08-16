// const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../startup/db/sequelize").getORM();

const User = sequelize.define("User", {
    // id: {
    //     type: Sequelize.INTEGER(11),
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true
    // },
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

User.generateAuthToken = (user) => {
    const token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            galleryId: user.galleryId
            // roles: [],
            // operations: []
        },
        config.get("jwtPrivateKey")
    );
    return token;
}

// function validateUser(user) {
//     const schema = Joi.object({
//         name: Joi.string()
//             .min(3)
//             .max(50)
//             .required(),
//         email: Joi.string()
//             .min(5)
//             .max(255)
//             .required()
//             .email(),
//         password: Joi.string()
//             .min(5)
//             .max(255)
//             .required()
//     });
//
//     return schema.validate(user);
// }

exports.User = User;
// exports.validateUser = validateUser;
