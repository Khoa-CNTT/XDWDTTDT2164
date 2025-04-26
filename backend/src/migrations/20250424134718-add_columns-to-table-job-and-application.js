"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("jobs", "candidate_requirements", {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.addColumn("jobs", "benefit", {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.addColumn("jobs", "work_time", {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.addColumn("applications", "employer_review", {
      type: Sequelize.ENUM("Phù hợp", "Chưa phù hợp"),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("jobs", "candidate_requirements");
    await queryInterface.removeColumn("jobs", "benefit");
    await queryInterface.removeColumn("jobs", "work_time");
    await queryInterface.removeColumn("jobs", "employer_review");
  },
};
