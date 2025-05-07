"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("employers", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        field: "user_id",
        onDelete: "CASCADE",
        references: {
          model: "users",
          key: "id",
        },
      },
      companyName: {
        type: Sequelize.STRING,
        field: "company_name",
      },
      companySlug: {
        type: Sequelize.STRING,
        field: "company_slug",
      },
      companyAddress: {
        type: Sequelize.STRING,
        field: "company_address",
      },
      companyWebsite: {
        type: Sequelize.STRING,
        field: "company_website",
      },
      companyLogo: {
        type: Sequelize.STRING,
        field: "company_logo",
      },
      companyDescription: {
        type: Sequelize.TEXT,
        field: "company_description",
      },
      companySize: {
        type: Sequelize.INTEGER,
        field: "company_size",
      },
      companyTaxCode: {
        type: Sequelize.STRING,
        field: "company_tax_code",
      },
      isApproved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: "is_approved",
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: "deleted_at",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "created_at",
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "updated_at",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("employers");
  },
};
