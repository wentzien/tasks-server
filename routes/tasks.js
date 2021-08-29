const express = require("express");
const router = express.Router({mergeParams: true});
const auth = require("../middleware/auth");
const _ = require("lodash");
const {Tasklist} = require("../models/Tasklist");
const {Task, validateTask} = require("../models/Task");
const {Collaborator} = require("../models/Collaborator");

router.get("/", [auth], async (req, res) => {
    const tasklist = await Tasklist.findOne({
       where: {id: req.params.tasklistId},
       include: {
           model: Collaborator,
           where: {
               UserId: req.user.id
           }
       }
    });
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    const tasks = await tasklist.getTasks();

    res.send(tasks);
});

router.post("/", [auth], async (req, res) => {
    const {error} = validateTask(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const tasklist = await Tasklist.findOne({
        where: {id: req.params.tasklistId},
        include: {
            model: Collaborator,
            where: {
                UserId: req.user.id,
                role: ["Creator", "Editor"]
            }
        }
    });
    if (!tasklist) return res.status(404).send("The tasklist with the given ID was not found.");

    const task = await Task.create({
            title: req.body.title,
            TasklistId: tasklist.id
        });

    res.send(task);
});

router.put("/:id", [auth], async (req, res) => {
    const {error} = validateTask(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const task = await Task.findByPk(req.params.id, {
       include: {
           model: Tasklist,
           where: {
               id: req.params.tasklistId
           },
           include: {
               model: Collaborator,
               where: {
                   UserId: req.user.id,
                   role: ["Creator", "Editor"]
               }
           }
       }
    });
    if (!task) return res.status(404).send("The tasklist or task with the given IDs was not" +
        " found.");

    task.title = req.body.title;
    task.description = req.body.description;
    task.notes = req.body.notes;
    task.dueAt = req.body.dueAt;
    task.done = req.body.done;
    task.doneAt = req.body.doneAt;
    task.important = req.body.important;
    task.today = req.body.today;

    await task.save();

    res.send(task);
});

router.delete("/:id", [auth], async (req, res) => {
    const task = await Task.findByPk(req.params.id, {
        include: {
            model: Tasklist,
            where: {
                id: req.params.tasklistId
            },
            include: {
                model: Collaborator,
                where: {
                    UserId: req.user.id,
                    role: ["Creator", "Editor"]
                }
            }
        }
    });
    if (!task) return res.status(404).send("The tasklist or task with the given IDs was not" +
        " found.");

    await task.destroy();

    res.send(task);
});

router.get("/:id", [auth], async (req, res) => {
    const task = await Task.findByPk(req.params.id, {
        include: {
            model: Tasklist,
            where: {
                id: req.params.tasklistId
            },
            include: {
                model: Collaborator,
                where: {
                    UserId: req.user.id,
                    role: ["Creator", "Editor"]
                }
            }
        }
    });
    if (!task) return res.status(404).send("The tasklist or task with the given IDs was not" +
        " found.");

    res.send(task);
});

module.exports = router;
