const mongoose = require("mongoose");
const Joi = require('joi');

const photoSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 255
    },
    sort: {
        type: Number,
        required: false
    }
});

const Photo = mongoose.model("Photo", photoSchema);

function validatePhoto(photo) {
    const schema = Joi.object({
        link: Joi.string().min(11).max(255).required(),
        sort: Joi.number()
    });

    return schema.validate(photo);
}

exports.Photo = Photo;
exports.photoSchema = photoSchema;
exports.validatePhoto = validatePhoto;