const {User} = require("./User");
const {Tasklist} = require("./Tasklist");
const {Task} = require("./Task");

module.exports = () => {
    // all associations

    // User - Tasklist
    User.belongsToMany(Tasklist, {through: "UserTasklists"});
    Tasklist.belongsToMany(User, {through: "UserTasklists"});

    // Tasklist - Todo
    Tasklist.hasMany(Task);
    Task.belongsTo(Tasklist);
};
