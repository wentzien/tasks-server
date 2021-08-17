const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const _ = require("lodash");
const {User} = require("../models/User");
const {Tasklist, validateTasklist} = require("../models/Tasklist");

router.get("/", [auth], async (req, res) => {
    const tasklists = await User.findAll({
        where: {id: req.user.id},
        include: Tasklist
    });
    res.send(tasklists);
});

router.post("/", [auth], async (req, res) => {
    const {error} = validateTasklist(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByPk(req.user.id);

    const tasklist = await Tasklist.create({
        name: req.body.name
    });

    await user.addTasklist(tasklist);

    res.send(tasklist);
});

router.put("/:id", [auth], async (req, res) => {
    const {error} = validateTasklist(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByPk(req.user.id);
    let tasklist = (await user.getTasklists({where: {id: req.params.id}}))[0]
    if(!tasklist) return res.status(400).send("Tasklist not found.");

    tasklist.name = req.body.name;

    await tasklist.save();

    tasklist = _.pick(tasklist, ["name"]);

    res.send(tasklist);
});

router.delete("/:id", [auth], async (req, res) => {
    const user = await User.findByPk(req.user.id);
    let tasklist = (await user.getTasklists({where: {id: req.params.id}}))[0]
    if(!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    tasklist.destroy();

    tasklist = _.pick(tasklist, ["name"]);

    res.send(tasklist);
});

router.get("/:id", [auth], async (req, res) => {
    const user = await User.findByPk(req.user.id);
    let tasklist = (await user.getTasklists({where: {id: req.params.id}}))[0]
    if(!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    res.send(tasklist);
});

module.exports = router;
