"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Xóa nhầm cộat "isRead" nếu đã tồn tại
    await queryInterface.removeColumn("notifications", "isRead");

    // Thêm đúng cột "is_read"
    await queryInterface.addColumn("notifications", "is_read", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("notifications", "isRead");
    await queryInterface.addColumn("notifications", "is_read", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
};
