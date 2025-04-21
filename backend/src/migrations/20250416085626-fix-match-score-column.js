"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Xóa nhầm cột 'math_score' nếu đã tồn tại
    await queryInterface.removeColumn("applications", "math_score");

    // Thêm đúng cột 'match_score'
    await queryInterface.addColumn("applications", "match_score", {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("applications", "match_score");
    await queryInterface.addColumn("applications", "math_score", {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });
  },
};
