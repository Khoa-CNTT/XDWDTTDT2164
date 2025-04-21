"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("jobs", "is_approved", {
      type: Sequelize.ENUM("Chờ kiểm duyệt", "Đã được duyệt", "Đã bị từ chối"),
      defaultValue: "Chờ kiểm duyệt",
    });
    await queryInterface.addColumn("jobs", "rejection_reason", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("jobs", "is_approved");
    await queryInterface.removeColumn("jobs", "rejection_reason");
  },
};
