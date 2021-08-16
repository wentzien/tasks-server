const config = require("config");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean,
    galleryId: {type: mongoose.Schema.Types.ObjectId, ref: "Gallery"}
});

userSchema.methods.generateAuthToken = (user) => {
    const token = jwt.sign(
        {
            _id: user._id,
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

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .required(),
        email: Joi.string()
            .min(5)
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

// async function getOneById(id) {
//     return await userCollection.findOne({_id: ObjectId(id)});
// }
//
// async function getOne(query) {
//     return await userCollection.findOne(query);
// }
//
// async function getAll(query, options = {}) {
//     return await userCollection.find(query, options);
// }
//
// async function updateOne(id, update, options = {}) {
//     return await userCollection.updateOneById({_id: ObjectId(id)}, {$set: update}, options);
// }
//
// async function insertOne(doc) {
//     return await userCollection.insertOne(doc);
// }



