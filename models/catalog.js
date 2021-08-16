const mongoose = require("mongoose");
const Joi = require('joi');
const {photoSchema} = require("./photo");

const catalogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    photos: [photoSchema]
});

const Catalog = mongoose.model("Catalog", catalogSchema);

function validateCatalog(catalog) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        photos: Joi.array()
    });

    return schema.validate(catalog);
}

exports.Catalog = Catalog;
exports.catalogSchema = catalogSchema;
exports.validateCatalog = validateCatalog;