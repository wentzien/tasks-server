const express = require("express");
const router = express.Router();
const {Op} = require("sequelize");
const auth = require("../middleware/auth");
const _ = require("lodash");
const {Tasklist} = require("../models/Tasklist");
const {Task} = require("../models/Task");
const {Collaborator} = require("../models/Collaborator");

router.get("/myday", [auth], async (req, res) => {
    const tasks = await Task.findAll({
        where: {today: true},
        include: {
            model: Tasklist,
            required: true,
            include: {
                model: Collaborator,
                required: true,
                where: {UserId: req.user.id},
            }
        }
    });

    res.send(tasks);
});

router.get("/important", [auth], async (req, res) => {
    const tasks = await Task.findAll({
        where: {important: true},
        include: {
            model: Tasklist,
            required: true,
            include: {
                model: Collaborator,
                required: true,
                where: {UserId: req.user.id},
            }
        }
    });

    res.send(tasks);
});

router.get("/planned", [auth], async (req, res) => {
    const tasks = await Task.findAll({
        where: {
            dueAt: {[Op.ne]: null},
            done: false
        },
        include: {
            model: Tasklist,
            required: true,
            include: {
                model: Collaborator,
                required: true,
                where: {UserId: req.user.id},
            }
        }
    });

    res.send(tasks);
});

router.get("/all", [auth], async (req, res) => {
    const tasks = await Task.findAll({
        include: {
            model: Tasklist,
            required: true,
            include: {
                model: Collaborator,
                required: true,
                where: {UserId: req.user.id},
            }
        }
    });

    res.send(tasks);
});

router.get("/done", [auth], async (req, res) => {
    const tasks = await Task.findAll({
        where: {done: true},
        include: {
            model: Tasklist,
            required: true,
            include: {
                model: Collaborator,
                required: true,
                where: {UserId: req.user.id},
            }
        }
    });

    res.send(tasks);
});

router.get("/assignedtome", [auth], async (req, res) => {
    res.send([]);
});

module.exports = router;
