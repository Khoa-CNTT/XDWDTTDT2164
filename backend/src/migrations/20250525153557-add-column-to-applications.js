"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("applications", "skills_match", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("applications", "experience_match", {
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("applications", "skills_match");
    await queryInterface.removeColumn("applications", "experience_match");
  },
};
