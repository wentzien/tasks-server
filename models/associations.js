const {User} = require("./User");
const {Tasklist} = require("./Tasklist");
const {Task} = require("./Task");
const {Collaborator} = require("./Collaborator");

module.exports = () => {
    // all associations

    // User (Creator) - Tasklist
    // User.hasMany(Tasklist);
    // Tasklist.belongsTo(User);

    // Collaborator - Tasklist
    Tasklist.hasMany(Collaborator);
    Collaborator.belongsTo(Tasklist);

    // User (collaborator) - Share
    User.hasMany(Collaborator);
    Collaborator.belongsTo(User);

    // User (invitedBy) - Share
    User.hasMany(Collaborator, {
        as: "InvitedBy",
        foreignKey: "InvitedByUserId"
    });
    Collaborator.belongsTo(User, {
        as: "InvitedBy",
    });

    // Tasklist - Task
    Tasklist.hasMany(Task);
    Task.belongsTo(Tasklist);
};
