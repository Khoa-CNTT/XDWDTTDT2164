const crypto = require("crypto");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const db = require("../models");
const ApiError = require("../libs/apiError");
const { StatusCode } = require("../libs/enum");
const {
  sendTokenEmail,
  sendTemporaryPasswordEmail,
} = require("../libs/sendMail");
const { hashPassword, verifyPassword } = require("../libs/hashPassword");
/**
 * Service xử lý logic nghiệp vụ liên quan đến user
 */
class UserService {
  /**
   * Lây thông tin cá nhân
   * @param {string} id - Id người dùng
   * @returns {Promise<Object>} - Trả về thông tin chi tiết người dùng
   */
  async getInfo(id) {
    return db.Users.findOne({
      where: { id },
      include: [
        {
          model: db.Candidates,
          as: "Candidates",
          include: [
            {
              model: db.Users,
              as: "Users",
              attributes: ["fullName", "phoneNumber"],
            },
            {
              model: db.CandidateSkills,
              as: "CandidateSkills",
              attributes: ["id"],
              include: [
                {
                  model: db.Skills,
                  as: "Skills",
                  attributes: ["skillName"],
                  include: [
                    {
                      model: db.Categories,
                      as: "Categories",
                      attributes: ["categoryName"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: db.EmployerUsers,
          as: "EmployerUsers",
          include: [
            {
              model: db.Employers,
              as: "Employers",
            },
          ],
        },
      ],
      attributes: {
        exclude: [
          "password",
          "refreshToken",
          "otp",
          "otpExpire",
          "passwordResetToken",
          "passwordResetExpire",
        ],
      },
    });
  }

  /**
   * Quên mật khẩu
   * @param {string} email - Email của người dùng
   * @returns {Promise<Object>} - Thông tin user đã lưu vào DB (ẩn mật khẩu)
   */
  async forgotPassword(email) {
    // Kiểm tra email có tồn tại trong DB không
    const user = await db.Users.findOne({ where: { email } });

    if (!user) {
      throw new ApiError(StatusCode.NOT_FOUND, "Email không tồn tại");
    }

    // Tạo token mới
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Lưu token vào DB
    await db.Users.update(
      { passwordResetToken: token, passwordResetExpire: tokenExpiresAt },
      { where: { email } }
    );

    // Gửi token qua email
    await sendTokenEmail(email, token);
  }

  /**
   * Đặt lại mật khẩu
   * @param {string} token - Token để đặt lại mật khẩu
   * @param {string} newPassword - Mật khẩu mới
   * @returns {Promise<Object>} - Thông tin user đã lưu vào DB (ẩn mật khẩu)
   */
  async resetPassword(token, newPassword) {
    // Kiểm tra token có tồn tại trong DB không
    const user = await db.Users.findOne({
      where: { passwordResetToken: token },
    });

    if (!user) {
      throw new ApiError(StatusCode.NOT_FOUND, "Token không tồn tại.");
    }

    if (Date.now() > user.passwordResetExpire) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Token đã hết hạn");
    }

    // Hash mật khẩu mới
    const hashedPassword = await hashPassword(newPassword);

    // Cập nhật mật khẩu mới
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpire = null;

    await user.save();

    return {
      message: "Mật khẩu đã được đặt lại thành công",
    };
  }

  /**
   * Thay đổi mật khẩu
   * @param {string} userID - ID của user
   * @param {string} passwordData - Dữ liệu mật khẩu
   * @returns {Promise<Object>} - Thông tin user đã lưu vào DB (ẩn mật khẩu)
   */
  async changePassword(userID, passwordData) {
    const user = await db.Users.findByPk(userID);

    // Kiểm tra user có tồn tại không
    if (!user) {
      throw new ApiError(StatusCode.NOT_FOUND, "Người dùng không tồn tại");
    }

    // Kiểm tra mật khẩu cũ có chính xác không
    const isPasswordCorrect = await verifyPassword(
      passwordData.oldPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Mật khẩu cũ không chính xác");
    }

    // Hash mật khẩu mới
    const hashedPassword = await hashPassword(passwordData.newPassword);

    // Cập nhật mật khẩu mới
    user.password = hashedPassword;
    await user.save();

    return {
      message: "Mật khẩu đã được thay đổi thành công",
    };
  }

  /**
   * Cập nhật thông tin nhà tuyển dụng
   * @param {string} userID - ID của user
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise<Object>} - Thông tin user đã lưu vào DB (ẩn mật khẩu)
   */
  async createEmployerProfile(userId, updateData) {
    const transaction = await db.sequelize.transaction();
    try {
      const user = await db.Users.findByPk(userId, { transaction });

      // Kiểm tra user có tồn tại không
      if (!user) {
        throw new ApiError(StatusCode.NOT_FOUND, "Người dùng không tồn tại");
      }

      // Kiểm tra xem user có phải là nhà tuyển dụng không
      if (user.role !== "employer") {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Người dùng không phải là nhà tuyển dụng"
        );
      }

      // Tạo slug từ tên công ty
      const slug = slugify(updateData.companyName, { lower: true });

      // Kiểm tra công ty đã tồn tại trong DB không
      const existingEmployer = await db.Employers.findOne({
        where: { companySlug: slug },
        transaction,
      });

      if (existingEmployer) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Công ty đã tồn tại");
      }

      // Tạo mới thông tin nhà tuyển dụng
      const employer = await db.Employers.create(
        { ...updateData, companySlug: slug },
        { transaction }
      );

      // Cập nhật thông tin employer user
      await db.EmployerUsers.create(
        { employerId: employer.id, userId, employerRole: "owner" },
        { transaction }
      );

      await transaction.commit();

      return {
        message: "Thông tin nhà tuyển dụng đã được cập nhật thành công",
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Duyệt nhà tuyển dụng
   * @param {string} employerId - ID của nhà tuyển dụng
   * @returns {Promise<Object>} - Thông tin nhà tuyển dụng
   */
  async approveEmployer(employerId) {
    const employer = await db.Employers.findByPk(employerId);

    if (!employer) {
      throw new ApiError(StatusCode.NOT_FOUND, "Công ty không tồn tại");
    }

    employer.isApproved = true;
    await employer.save();
    return {
      message: "Công ty đã được duyệt thành công",
    };
  }

  /**
   * Lấy thông tin nhà tuyển dụng
   * @param {string} companyId - slug của nhà tuyển dụng
   * @returns {Promise<Object>} - Thông tin nhà tuyển dụng
   */
  async getEmployerProfile(companyId) {
    const employer = await db.Employers.findOne({
      where: { id: companyId },
    });

    if (!employer) {
      throw new ApiError(StatusCode.NOT_FOUND, "Công ty không tồn tại");
    }

    return employer;
  }

  /**
   * Lấy thông tin chi tiết nhà tuyển dụng
   * @param {string} slug - slug của nhà tuyển dụng
   * @returns {Promise<Object>} - Thông tin nhà tuyển dụng
   */
  async getEmployerDetail(slug) {
    const employer = await db.Employers.findOne({
      where: { companySlug: slug },
    });

    if (!employer) {
      throw new ApiError(StatusCode.NOT_FOUND, "Công ty không tồn tại");
    }

    const jobs = await db.Jobs.findAll({
      where: {
        employerId: employer.id,
        isVisible: true,
        isApproved: "Đã được duyệt",
        isExpired: false,
      },
      include: [
        {
          model: db.Employers,
          as: "Employers",
        },
        {
          model: db.Ranks,
          as: "Ranks",
        },
        {
          model: db.Salaries,
          as: "Salaries",
        },
        {
          model: db.JobTypes,
          as: "JobTypes",
        },
      ],
    });
    return { employer, jobs };
  }

  /**
   * Lấy danh sách nhà tuyển dụng
   * @returns {Promise<Object>} - Danh sách nhà tuyển dụng
   */
  async getEmployerList(query) {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.max(parseInt(query.limit) || 10, 1);
    const offset = (page - 1) * limit;
    const search = query.search || ""; // Tìm kiếm theo tên công ty
    const address = query.address || ""; // Tìm kiếm theo đỉa chỉ
    const industry = query.industry || ""; // Tìm kiếm theo ngành nghề

    const whereClause = {
      isApproved: true,
    };

    if (search) {
      whereClause.companyName = {
        [db.Sequelize.Op.like]: `%${search}%`, // Tìm kiếm không phân biệt hoa thường
      };
    }

    if (address) {
      whereClause.companyAddress = {
        [db.Sequelize.Op.like]: `%${address}%`,
      };
    }

    if (industry) {
      whereClause.industry = industry;
    }

    const { count: totalEmployers, rows: employers } =
      await db.Employers.findAndCountAll({
        where: whereClause,
        offset,
        limit,
      });

    return {
      page,
      limit,
      totalCount: totalEmployers,
      totalPages: Math.ceil(totalEmployers / limit),
      employers,
    };
  }
  /**
   * Lấy danh sách nhà tuyển dụng cho admin
   * @returns {Promise<Object>} - Danh sách nhà tuyển dụng cho admin
   */
  async getEmployerListForAdmin(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count: totalEmployers, rows: employers } =
      await db.Employers.findAndCountAll({
        limit,
        offset,
      });

    return {
      page,
      limit,
      totalEmployers,
      employers,
    };
  }

  /**
   * Thêm nhân viên vào công ty
   * @param {string} employerId - ID của nhà tuyển dụng
   * @param {Object} employeeData - Dữ liệu nhân viên
   * @returns {Promise<Object>} - Thông tin nhân viên
   */
  async addEmployeeToEmployer(employerId, employeeData) {
    const transaction = await db.sequelize.transaction();
    try {
      // Kiểm tra nhà tuyển dụng có tồn tại không
      const employer = await db.Employers.findByPk(employerId, { transaction });
      if (!employer) {
        throw new ApiError(StatusCode.NOT_FOUND, "Công ty không tồn tại");
      }

      // Kiểm tra xem email hoặc số điện thoại đã tồn tại trong db không
      const existingUser = await db.Users.findOne({
        where: {
          [db.Sequelize.Op.or]: [
            { email: employeeData.email },
            { phoneNumber: employeeData.phoneNumber },
          ],
        },
        transaction,
      });

      if (existingUser) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Email hoặc số điện thoại đã tồn tại"
        );
      }

      // Tạo mật khẩu tạm thời
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await hashPassword(tempPassword);

      // Tạo mới nhân viên
      const user = await db.Users.create(
        {
          email: employeeData.email,
          fullName: employeeData.fullName,
          phoneNumber: employeeData.phoneNumber,
          address: employeeData.address,
          role: "employer",
          password: hashedPassword,
        },
        { transaction }
      );

      // Tạo mới thông tin nhân viên trong EmployerUsers
      await db.EmployerUsers.create(
        {
          employerId,
          userId: user.id,
          employerRole: employeeData.employerRole,
        },
        { transaction }
      );

      // Gửi mail tài khoản và mật khẩu
      await sendTemporaryPasswordEmail(user.email, tempPassword);

      // Commit transaction khi mọi thứ thành công
      await transaction.commit();

      return {
        message: "Nhân viên đã được thêm vào công ty thành công",
      };
    } catch (error) {
      // Rollback nếu có lỗi
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Lấy danh sách nhân viên của nhà tuyển dụng
   * @param {string} employerId - ID của nhà tuyển dụng
   * @returns {Promise<Object>} - Danh sách nhân viên
   */
  async getEmployerEmployees(employerId) {
    const employees = await db.EmployerUsers.findAll({
      where: { employerId },
      include: [
        {
          model: db.Users,
          as: "Users",
          attributes: ["id", "fullName", "email", "phoneNumber"],
        },
        {
          model: db.EmployerUsers,
          as: "EmployerUsers",
          attributes: ["employerRole"],
        },
      ],
    });

    return employees;
  }

  /**
   * Lấy danh sách ứng viên
   * @returns {Promise<Object>} - Danh sách ứng viên
   */
  async getCandidates(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const { count: totalCandidate, rows: candidates } =
      await db.Candidates.findAndCountAll({
        offset: skip,
        limit,
      });

    return { page, limit, totalCandidate, candidates };
  }

  /**
   * Tạo mới thông tin ứng viên
   * @param {Object} candidateData - Dữ liệu ứng viên
   * @returns {Promise<Object>} - Thông tin ứng viên
   */
  async createCandidateProfile(candidateData, userId) {
    const transaction = await db.sequelize.transaction();

    try {
      const user = await db.Users.findByPk(userId, { transaction });

      if (!user) {
        throw new ApiError(StatusCode.NOT_FOUND, "Người dùng không tồn tại");
      }

      if (user.role !== "candidate") {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Người dùng không phải là ứng viên"
        );
      }

      const candidate = await db.Candidates.create(
        {
          gender: candidateData.gender,
          dateOfBirth: candidateData.dateOfBirth,
          address: candidateData.address,
          workExperience: candidateData.workExperience,
          salary: candidateData.salary,
          userId,
          cvUrl: candidateData.cvUrl,
        },
        {
          transaction,
        }
      );

      // Tạo mới candidate skill
      await db.CandidateSkills.bulkCreate(
        candidateData.skillIds.map((skillId) => ({
          candidateId: candidate.id,
          skillId,
        })),
        { transaction }
      );

      await transaction.commit();

      return {
        message: "Thông tin ứng viên đã được tạo thành công",
        data: candidate,
      };
    } catch (error) {
      await transaction.rollback();

      // 🗑 Xóa file nếu có lỗi
      if (filePath) {
        try {
          fs.unlinkSync(path.join(__dirname, "../uploads", filePath));
          console.log(`🗑 File ${filePath} đã bị xóa do lỗi`);
        } catch (fsError) {
          console.error("❌ Lỗi khi xóa file:", fsError.message);
        }
      }

      throw error;
    }
  }

  /**
   * Lấy danh sách người dùng
   * @param {Object} query
   * @returns {Promise<Object>}
   */
  async getUsers(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count: totalUsers, rows: users } = await db.Users.findAndCountAll({
      limit,
      offset,
      attributes: [
        "id",
        "fullName",
        "phoneNumber",
        "email",
        "role",
        "emailVerify",
      ],
    });

    return {
      page,
      limit,
      totalUsers,
      users,
    };
  }

  /**
   * Cập nhật thông tin người dùng bởi admin
   * @param {Object} userData - Dữ liệu cập nhật
   * @param {string} id - Mã người dùng
   * @returns {Promise<Object>}
   */
  async updateUser(userId, userData) {
    // Kiểm tra xem user có tồn tại không
    const userExist = await db.Users.findByPk(userId);
    if (!userExist) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Không tìm thấy người dùng");
    }

    // cập nhật người dùng
    userExist.fullName = userData.fullName;
    userExist.role = userData.role;

    await userExist.save();

    return userExist;
  }
}

module.exports = new UserService();
