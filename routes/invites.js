const express = require("express");
const router = express.Router({mergeParams: true});
const auth = require("../middleware/auth");
const {User} = require("../models/User");
const {Tasklist} = require("../models/Tasklist");
const {Collaborator, validateCollaborator} = require("../models/Collaborator");

router.get("/", [auth], async (req, res) => {
    const tasklist = await Tasklist.findOne({
        where: {id: req.params.id},
        include: {
            model: Collaborator,
            where: {UserId: req.user.id}
        }
    });
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    const invitedUsers = await User.findAll({
        attributes: ["email", "name"],
        include: {
            model: Collaborator,
            where: {TasklistId: req.params.tasklistId}
        }
    });

    res.send(invitedUsers);
});

router.post("/", [auth], async (req, res) => {
    const {error} = validateCollaborator(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const tasklist = await Tasklist.fineOne({
        where: {id: req.params.tasklistId},
        include: {
            model: Collaborator,
            where: {
                UserId: req.user.id,
                role: "Creator"
            }
        }
    });
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    const invitedUser = await User.findOne({
        where: {email: req.body.email},
        include: {
            model: Collaborator,
            required: false,
            where: {
                TasklistId: req.params.tasklistId
            }
        }
    });
    if (!invitedUser) return res.status(404).send("Invited user could not be found.");
    if (invitedUser.Collaborators[0]) return res.status(404).send("User is already invited.");

    const collaborator = await Collaborator.create({
        role: req.body.role || "Editor",
        status: "Invited",
        TasklistId: tasklist.id,
        UserId: invitedUser.id,
        InvitedByUserId: req.user.id
    });

    res.send(collaborator);
});


module.exports = router;
