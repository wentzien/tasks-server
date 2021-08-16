const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {User} = require("../models/User");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
    const user = await User.findOne({where: {id: req.user.id}});
    res.send(user);
});

router.post("/", async (req, res) => {
    // const {error} = validateUser(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({where: {email: req.body.email}});
    if (user) return res.status(400).send("User already registered.");

    let userObj = _.pick(req.body, ["name", "email", "password"]);
    user = User.build(userObj);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
