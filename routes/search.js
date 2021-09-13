const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Joi = require("joi");
const {Op} = require("sequelize");
const {Tasklist} = require("../models/Tasklist");
const {Task} = require("../models/Task");
const {Collaborator} = require("../models/Collaborator");

router.get("/:searchTerm", [auth], async (req, res) => {
    const {error} = validateSearchTerm(req.params.searchTerm)
    if (error) res.status(400).send(error.details[0].message);

    const {searchTerm} = req.params;

    const hits = await Tasklist.findAll({
        include: [
            {
                model: Collaborator,
                required: true,
                where: {
                    UserId: req.user.id,
                    status: ["Owner", "Accepted"]
                }
            },
            {
                model: Task,
                required: true,
                where: {
                    [Op.or]: [
                        {title: {[Op.substring]: searchTerm}},
                        {description: {[Op.substring]: searchTerm}},
                        {notes: {[Op.substring]: searchTerm}}
                    ]
                }
            }
        ]
    });

    res.send(hits);
});

const validateSearchTerm = searchTerm => {
    const schema = Joi.string();
    return schema.validate(searchTerm);
};

module.exports = router;
