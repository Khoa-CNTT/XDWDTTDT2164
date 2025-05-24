"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Mã hoá mật khẩu mẫu
    const matKhauMaHoa = await bcrypt.hash("123456", 10);

    // Danh sách vai trò không bao gồm 'admin'
    const vaiTro = ["candidate", "employer"];
    const nguoiDungs = [];

    for (let i = 1; i <= 10; i++) {
      const role = vaiTro[i % 2]; // Xen kẽ giữa candidate và employer

      nguoiDungs.push({
        id: uuidv4(),
        full_name: `Người Dùng ${i}`,
        email: `nguoidung${i}@example.com`,
        phone_number: `09000000${i}`,
        password: matKhauMaHoa,
        email_verify: true, // ✅ Email đã xác thực
        otp: null,
        otp_expire: null,
        refresh_token: null,
        password_reset_token: null,
        password_reset_expire: null,
        role: role,
        is_blocked: false,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Thêm dữ liệu vào bảng users
    return queryInterface.bulkInsert("users", nguoiDungs);
  },

  async down(queryInterface, Sequelize) {
    // Xoá toàn bộ dữ liệu đã thêm
    return queryInterface.bulkDelete("users", null, {});
  },
};
