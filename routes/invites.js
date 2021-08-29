const express = require("express");
const router = express.Router({mergeParams: true});
const auth = require("../middleware/auth");
const {User} = require("../models/User");
const {Tasklist} = require("../models/Tasklist");
const {Share, validateShare} = require("../models/Share");

router.get("/", [auth], async (req, res) => {
    const userInvites = await User.findAll({
        attributes: ["email", "name"],
        include: {
            as: "InvitedUser",
            model: Share,
            where: {TasklistId: req.params.tasklistId}
        }
    });

    res.send(userInvites);
});

router.post("/", [auth], async (req, res) => {
    const {error} = validateShare(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const tasklist = await Tasklist.findByPk(req.params.tasklistId, {
        include: User
    });
    if (!tasklist) return res.status(404).send(
        "The tasklist with the given ID was not found.");

    if (tasklist.User.id !== req.user.id) return res.status(400).send("Access denied.");

    const invitedUser = await User.findOne({
        where: {email: req.body.email},
        include: {
            model: Share,
            as: "InvitedUser",
            required: false,
            where: {
                TasklistId: req.params.tasklistId
            }
        }
    });
    if(!invitedUser) return res.status(404).send("User could not be found.");
    if (invitedUser.InvitedUser[0]) return res.status(404).send("User is already invited.");

    const share = await Share.create({
        role: req.body.role || "Editor",
        status: "Invited",
        TasklistId: tasklist.id,
        InvitedUserId: invitedUser.id,
        InvitedByUserId: tasklist.User.id
    });

    res.send(share);
});


module.exports = router;
