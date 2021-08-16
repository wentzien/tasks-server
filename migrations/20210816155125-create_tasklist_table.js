'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("tasklist", {
            // ------------------------------------------------------


            // ------------------------------------------------------
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("tasklist");
    }
};
