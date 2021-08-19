const express = require("express");
const router = express.Router({mergeParams: true});
const auth = require("../middleware/auth");
const _ = require("lodash");
const {User} = require("../models/User");
const {Task, validateTask} = require("../models/Task");

router.get("/", [auth], async (req, res) => {
    const user = await User.findByPk(req.user.id);
    let tasklist = (await user.getTasklists({where: {id: req.params.tasklistId}}))[0]
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    const tasks = await tasklist.getTasks();

    res.send(tasks);
});

router.post("/", [auth], async (req, res) => {
    const {error} = validateTask(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByPk(req.user.id);
    let tasklist = (await user.getTasklists({where: {id: req.params.tasklistId}}))[0]
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    const task = await Task.create({
        description: req.body.description
    });

    await tasklist.addTask(task);

    res.send(task);
});

router.put("/:id", [auth], async (req, res) => {
    const {error} = validateTask(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByPk(req.user.id);
    let tasklist = (await user.getTasklists({where: {id: req.params.tasklistId}}))[0]
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    let task = (await tasklist.getTasks({where: {id: req.params.id}}))[0];
    if (!task) return res.status(404).send("The task with the given ID was not found.");

    task.description = req.body.description;

    await task.save();

    task = _.pick(task, ["description"]);

    res.send(task);
});

router.delete("/:id", [auth], async (req, res) => {
    const user = await User.findByPk(req.user.id);
    let tasklist = (await user.getTasklists({where: {id: req.params.tasklistId}}))[0]
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    let task = (await tasklist.getTasks({where: {id: req.params.id}}))[0];
    if (!task) return res.status(404).send("The task with the given ID was not found.");

    await task = task.destroy();

    task = _.pick(task, ["description"]);

    res.send(task);
});

router.get("/:id", [auth], async (req, res) => {
    const user = await User.findByPk(req.user.id);
    let tasklist = (await user.getTasklists({where: {id: req.params.tasklistId}}))[0]
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    let task = (await tasklist.getTasks({where: {id: req.params.id}}))[0];
    if (!task) return res.status(404).send("The task with the given ID was not found.");

    res.send(task);
});

module.exports = router;