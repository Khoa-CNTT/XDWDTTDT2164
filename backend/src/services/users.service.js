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
const { cloudinary } = require("../config/cloudinary.config");

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
          model: db.Employers,
          as: "Employers",
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
        { ...updateData, companySlug: slug, userId },
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
  async approveEmployer(employerId, status) {
    const employer = await db.Employers.findByPk(employerId);

    if (!employer) {
      throw new ApiError(StatusCode.NOT_FOUND, "Công ty không tồn tại");
    }

    if (status === true) {
      employer.isApproved = "Đã kiểm duyệt";
    } else {
      employer.isApproved = "Đã từ chối";
    }
    await employer.save();
    return {
      message: status
        ? "Công ty đã được duyệt thành công"
        : "Công ty đã bị từ chối",
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
      isApproved: "Đã kiểm duyệt",
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
      whereClause.industry = {
        [db.Sequelize.Op.like]: `%${industry}%`,
      };
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

      if (typeof candidateData.skillIds === "string") {
        try {
          candidateData.skillIds = JSON.parse(candidateData.skillIds);
        } catch (error) {
          throw new ApiError(
            StatusCode.BAD_REQUEST,
            "Danh sách kỹ năng không hợp lệ"
          );
        }
      }

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
      if (candidateData.cvUrl) {
        try {
          fs.unlinkSync(
            path.join(__dirname, "../uploads", candidateData.cvUrl)
          );
          console.log(`🗑 File ${candidateData.cvUrl} đã bị xóa do lỗi`);
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
        "isBlocked",
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

  /**
   * Cập nhật thông tin nhà tuyển dụng
   * @param {Object} employerData - Dữ liệu cập nhật
   * @param {string} id - Mã nhà tuyển dụng
   * @returns {Promise<Object>}
   */
  async updateEmployerProfile(id, employeeData) {
    const employer = await db.Employers.findOne({
      where: { id },
    });

    if (!employer) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Không tìm thấy hồ sơ công ty"
      );
    }

    if (
      employeeData.companyLogo &&
      employer.companyLogo &&
      employer.companyLogo !== employeeData.companyLogo
    ) {
      await cloudinary.uploader.destroy(employer.companyLogo);
    }

    Object.assign(employer, employeeData); // Cập nhật dữ liệu
    await employer.save(); // Lưu lại

    return employer; // employer đã cập nhật
  }

  /**
   * Cập nhật thông tin ứng viên
   * @param {Object} candidateData - Dữ liệu cập nhật
   * @param {string} id - Mã ứng viên
   * @returns {Promise<void>}
   */
  async updateCandidateProfile(id, candidateData) {
    const candidate = await db.Candidates.findOne({
      where: { id },
    });

    if (!candidate) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Không tìm thấy hồ sơ ứng viên"
      );
    }

    if (candidateData.cvUrl && candidate.cvUrl) {
      const oldCvPath = path.join(__dirname, "../uploads", candidate.cvUrl);
      if (fs.existsSync(oldCvPath)) {
        fs.unlinkSync(oldCvPath);
      }
    }

    Object.assign(candidate, candidateData);
    await candidate.save();

    return candidate;
  }

  /**
   * Cập nhật trạng thái khóa của người dùng
   * @param {string} id - Mã người dùng
   * @param {boolean} isBlocked - Trạng thái khóa (true = khóa, false = mở)
   */
  async setBlockStatus(id, isBlocked) {
    const user = await db.Users.findByPk(id);
    if (!user) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Không tìm thấy người dùng");
    }

    if (user.isBlocked === isBlocked) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        isBlocked ? "Người dùng đã bị khóa" : "Người dùng đang mở khóa"
      );
    }
    user.isBlocked = isBlocked;
    await user.save();

    return {
      message: isBlocked
        ? "Khóa người dùng thành công"
        : "Mở khóa người dùng thành công",
    };
  }
}

module.exports = new UserService();
