const mongoose = require("mongoose");
const Joi = require('joi');
const {catalogSchema} = require("./catalog");

const gallerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    catalogs: [catalogSchema]
});

const Gallery = mongoose.model("Gallery", gallerySchema);

function validateGallery(gallery) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        catalogs: Joi.array()
    });

    return schema.validate(gallery);
}

exports.Gallery = Gallery;
exports.gallerySchema = gallerySchema;
exports.validateGallery = validateGallery;