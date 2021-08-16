const {User} = require("./user");
const {Tasklist} = require("./tasklist");
const {Task} = require("./task");

module.exports = () => {
    // all associations

    // User - Tasklist
    User.belongsToMany(Tasklist, {through: "UserTasklists"});
    Tasklist.belongsToMany(User, {through: "UserTasklists"});

    // Tasklist - Todo
    Tasklist.hasMany(Task);
    Task.belongsTo(Tasklist);
};
