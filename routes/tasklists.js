const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const _ = require("lodash");
const {User} = require("../models/User");
const {Tasklist, validateTasklist} = require("../models/Tasklist");
const {Collaborator} = require("../models/Collaborator");
const task = require("./tasks");
const invite = require("./invites");

router.get("/", [auth], async (req, res) => {
    const tasklists = await Tasklist.findAll({
        include: {
            model: Collaborator,
            where: {
                UserId: req.user.id,
                status: ["Owner", "Accepted"]
            }
        }
    });

    res.send(tasklists);
});

router.post("/", [auth], async (req, res) => {
    const {error} = validateTasklist(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const tasklist = await Tasklist.create({
        title: req.body.title
    });

    await Collaborator.create({
        role: "Creator",
        status: "Owner",
        TasklistId: tasklist.id,
        UserId: req.user.id
    });

    res.send(tasklist);
});

router.put("/:id", [auth], async (req, res) => {
    const {error} = validateTasklist(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const tasklist = await Tasklist.findOne({
        where: {id: req.params.id},
        include: {
            model: Collaborator,
            where: {UserId: req.user.id}
        }
    });
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    tasklist.title = req.body.title;

    await tasklist.save();

    res.send(tasklist);
});

router.delete("/:id", [auth], async (req, res) => {
    const tasklist = await Tasklist.findOne({
        where: {id: req.params.id},
        include: {
            model: Collaborator,
            where: {UserId: req.user.id}
        }
    });
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    await tasklist.destroy();

    res.send(tasklist);
});

router.get("/:id", [auth], async (req, res) => {
    const tasklist = await Tasklist.findOne({
        where: {id: req.params.id},
        include: {
            model: Collaborator,
            where: {UserId: req.user.id}
        }
    });
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    res.send(tasklist);
});


router.use("/:tasklistId/tasks", task);

router.use("/:tasklistId/invites", invite);

module.exports = router;
