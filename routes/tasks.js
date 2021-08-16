const express = require("express");
const router = express.Router();
const {User} = require("../models/user");

router.get("/", async (req, res) => {
    const user = await User.create({name: "dennis", email:"dennis@wentzien.xyz", password: "123"});
    res.send(user);
});

module.exports = router;