const {User} = require("./User");
const {Tasklist} = require("./Tasklist");
const {Task} = require("./Task");
const {Share} = require("./Share");

module.exports = () => {
    // all associations

    // User (Creator) - Tasklist
    User.hasMany(Tasklist);
    Tasklist.belongsTo(User);

    // Share - Tasklist
    Tasklist.hasMany(Share);
    Share.belongsTo(Tasklist);

    // User (invited) - Share
    User.hasMany(Share, {
        as: "InvitedUser",
        foreignKey: "InvitedUserId"
    });
    Share.belongsTo(User, {
        as: "InvitedUser"
    })

    // User (invitedBy) - Share
    User.hasMany(Share, {
        as: "InvitedByUser",
        foreignKey: "InvitedByUserId"
    });
    Share.belongsTo(User, {
        as: "InvitedByUser",
    });

    // Tasklist - Task
    Tasklist.hasMany(Task);
    Task.belongsTo(Tasklist);
};
