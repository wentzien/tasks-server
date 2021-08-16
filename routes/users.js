const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {User, validateUser} = require("../models/user");
const {Gallery} = require("../models/gallery");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password"); // req.user.id added by auth middleware
    res.send(user);
});

router.post("/", async (req, res) => {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send("User already registered.");

    let gallery = await Gallery.findOne({name: req.body.name});
    if(gallery) return res.status(400).send("Name is already taken.");

    // create the gallery for the user
    gallery = new Gallery(_.pick(req.body, ["name"]));
    await gallery.save();

    let userObj = _.pick(req.body, ["name", "email", "password"]);
    userObj.galleryId = gallery._id;
    user = new User(userObj);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken(user);
    res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
