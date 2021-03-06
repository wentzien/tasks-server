const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {User} = require("../models/User");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    const {error} = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({where: {email: req.body.email}});
    if (!user) return res.status(400).send("Invalid email or password.");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid email or password.");

    const token = user.generateAuthToken();
    res.send(token);
});

function validateAuth(reqBody) {
    const schema = Joi.object({
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(reqBody);
}

module.exports = router; 
