const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const _ = require("lodash");
const {Op} = require("sequelize");
const {User} = require("../models/User");
const {Tasklist, validateTasklist} = require("../models/Tasklist");
const {Share} = require("../models/Share");
const task = require("./tasks");
const invite = require("./invites");

router.get("/", [auth], async (req, res) => {
    const userTasklists = (await User.findAll({
        where: {id: req.user.id},
        include: Tasklist
    }))[0];

    const tasklists = userTasklists.Tasklists;

    res.send(tasklists);
});

router.post("/", [auth], async (req, res) => {
    const {error} = validateTasklist(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByPk(req.user.id);

    const tasklist = await Tasklist.create({
        title: req.body.title
    });

    await user.addTasklist(tasklist);

    res.send(tasklist);
});

router.put("/:id", [auth], async (req, res) => {
    const {error} = validateTasklist(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByPk(req.user.id);
    const tasklist = (await user.getTasklists({where: {id: req.params.id}}))[0]
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    tasklist.title = req.body.title;

    await tasklist.save();

    res.send(tasklist);
});

router.delete("/:id", [auth], async (req, res) => {
    const user = await User.findByPk(req.user.id);
    const tasklist = (await user.getTasklists({where: {id: req.params.id}}))[0]
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    tasklist.destroy();

    res.send(tasklist);
});

// ---------------------------------------------------------------
// shared lists
router.get("/shared", [auth], async (req, res) => {
    const userSharedLists = await Tasklist.findAll({
        include: {
            model: Share,
            where: {
                status: ["Accepted", "Declined"],
                InvitedUserId: req.user.id
            }
        }
    });

    res.send(userSharedLists);
});
// ---------------------------------------------------------------

router.get("/:id", [auth], async (req, res) => {
    const user = await User.findByPk(req.user.id);
    let tasklist = (await user.getTasklists({where: {id: req.params.id}}))[0]
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    res.send(tasklist);
});


router.use("/:tasklistId/tasks", task);

router.use("/:tasklistId/invites", invite);

module.exports = router;
