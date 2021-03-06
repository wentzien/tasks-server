const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {User, validateUser} = require("../models/User");
const {Collaborator} = require("../models/Collaborator");
const {Tasklist} = require("../models/Tasklist");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
    let user = await User.findOne({where: {id: req.user.id}});

    user = _.pick(user, ["id", "name", "email", "createdAt", "updatedAt"]);

    res.send(user);
});

router.post("/", async (req, res) => {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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
        .send(token);
})

// -----------------------------------------------------------
// invites

router.get("/invites", [auth], async (req, res) => {
    const invites = await Collaborator.findAll({
        where: {
            UserId: req.user.id,
            status: "Invited"
        },
        include: [
            {
                model: Tasklist,
                attributes: ["title"]
            },
            {
                model: User,
                as: "InvitedByUser",
                attributes: ["name"]
            }
        ]
    });

    res.send(invites);
});

router.get("/invites/:collaboratorId/:status", [auth], async (req, res) => {
    if (req.params.status !== "accept" && req.params.status !== "decline") return res.status(404).send("Invite status cannot be changed.");
    const invite = await Collaborator.findOne({
        where: {
            id: req.params.collaboratorId,
            status: "Invited",
            UserId: req.user.id
        }
    });
    if (!invite) return res.status(404).send("Invite was not found or is not longer active.");

    invite.status = req.params.status === "accept" ? "Accepted" : "Declined";
    await invite.save();

    res.send(invite);
});

router.get("/invites/:tasklistId/decline", [auth], async (req, res) => {

});

module.exports = router;
