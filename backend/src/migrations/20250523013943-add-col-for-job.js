"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("jobs", "rejection_count", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: "rejection_count",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("jobs", "rejection_count");
  },
};
