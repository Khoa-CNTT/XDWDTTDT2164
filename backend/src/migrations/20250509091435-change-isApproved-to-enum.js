module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("employers", "is_approved", {
      type: Sequelize.ENUM("Chờ kiểm duyệt", "Đã kiểm duyệt", "Đã từ chối"),
      defaultValue: "Chờ kiểm duyệt",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("employers", "is_approved", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
};
