const express = require("express");
const router = express.Router();
const {Op} = require("sequelize");
const auth = require("../middleware/auth");
const _ = require("lodash");
const {User} = require("../models/User");
const {Tasklist} = require("../models/Tasklist");
const {Task} = require("../models/Task");

router.get("/myday", [auth], async (req, res) => {
    const userTasklists = (await User.findAll({
        where: {id: req.user.id},
        include: {
            model: Tasklist,
            include: {
                model: Task,
                where: {today: true}
            }
        }
    }))[0];

    let tasks = getTasksFromTasklists(userTasklists);

    res.send(tasks);
});

router.get("/important", [auth], async (req, res) => {
    const userTasklists = (await User.findAll({
        where: {id: req.user.id},
        include: {
            model: Tasklist,
            include: {
                model: Task,
                where: {important: true}
            }
        }
    }))[0];

    let tasks = getTasksFromTasklists(userTasklists);

    res.send(tasks);
});

router.get("/planned", [auth], async (req, res) => {
    const userTasklists = (await User.findAll({
        where: {id: req.user.id},
        include: {
            model: Tasklist,
            include: {
                model: Task,
                where: {
                    dueAt: {[Op.ne]: null},
                    done: false
                }
            }
        }
    }))[0];

    let tasks = getTasksFromTasklists(userTasklists);

    res.send(tasks);
});

router.get("/all", [auth], async (req, res) => {
    const userTasklists = (await User.findAll({
        where: {id: req.user.id},
        include: {
            model: Tasklist,
            include: Task
        }
    }))[0];

    let tasks = getTasksFromTasklists(userTasklists);

    res.send(tasks);
});

router.get("/done", [auth], async (req, res) => {
    const userTasklists = (await User.findAll({
        where: {id: req.user.id},
        include: {
            model: Tasklist,
            include: {
                model: Task,
                where: {done: true}
            }
        }
    }))[0];

    let tasks = getTasksFromTasklists(userTasklists);

    res.send(tasks);
});

router.get("/assignedtome", [auth], async (req, res) => {
    res.send([]);
});


function getTasksFromTasklists(tasklists) {
    let tasks = [];

    for (const tasklist of tasklists.Tasklists) {
        tasks = [...tasks, ...tasklist.Tasks];
    }

    return tasks;
}

module.exports = router;
