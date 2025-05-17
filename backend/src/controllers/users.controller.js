const userService = require("../services/users.service");
const { StatusCode } = require("../libs/enum");
const ApiError = require("../libs/apiError");
const { resSuccess, resError } = require("../libs/response");

/**
 * Controller xử lý logic liên quan đến user
 */
class UserController {
  /**
   * Lấy ra thông tin cá nhân
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async getInfo(req, res) {
    try {
      const { id } = req.user;
      const result = await userService.getInfo(id);
      return resSuccess(res, null, result);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Quên mật khẩu
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      await userService.forgotPassword(email);

      return resSuccess(res, "Email đã được gửi tới người dùng");
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Đặt lại mật khẩu
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      await userService.resetPassword(token, newPassword);

      return resSuccess(res, "Mật khẩu đã được đặt lại thành công");
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Thay đổi mật khẩu
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async changePassword(req, res) {
    try {
      const { id } = req.user;
      const { oldPassword, newPassword } = req.body;

      await userService.changePassword(id, { oldPassword, newPassword });

      return resSuccess(res, "Đổi mật khẩu thành công");
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Cập nhật thông tin nhà tuyển dụng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async createEmployerProfile(req, res) {
    try {
      const { id } = req.user;
      const {
        companyName,
        companyAddress,
        companyWebsite,
        companyDescription,
        companySize,
        companyTaxCode,
        industry,
      } = req.body;

      if (!req.file || !req.file.filename) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Ảnh đại diện không hợp lệ");
      }

      const avatar = req.file.filename;

      const updateData = {
        companyName,
        companyAddress,
        companyWebsite,
        companyDescription,
        companySize,
        companyTaxCode,
        industry,
        companyLogo: avatar,
      };

      await userService.createEmployerProfile(id, updateData);

      return resSuccess(
        res,
        "Thông tin nhà tuyển dụng đã được cập nhật thành công"
      );
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Duyệt nhà tuyển dụng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async approveEmployer(req, res) {
    try {
      const { employerId } = req.params;
      const { status } = req.body;
      const data = await userService.approveEmployer(employerId, status);

      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy thông tin nhà tuyển dụng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async getEmployerProfile(req, res) {
    try {
      const { employerId } = req.params;

      const employer = await userService.getEmployerProfile(employerId);

      return resSuccess(res, null, employer);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy thông tin chi tiết nhà tuyển dụng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async getEmployerDetail(req, res) {
    try {
      const { slug } = req.params;

      const employer = await userService.getEmployerDetail(slug);

      return resSuccess(res, null, employer);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy danh sách nhà tuyển dụng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async getEmployerList(req, res) {
    try {
      const employers = await userService.getEmployerList(req.query);

      return resSuccess(res, null, employers);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy danh sách nhà tuyển dụng cho admin
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async getEmployerListForAdmin(req, res) {
    try {
      const data = await userService.getEmployerListForAdmin(req.query);
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy danh sách ứng viên
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async getCandidates(req, res) {
    try {
      const data = await userService.getCandidates(req.query);
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Tạo mới thông tin ứng viên
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async createCandidateProfile(req, res) {
    try {
      console.log(req.body);
      const { id } = req.user;
      const { gender, dateOfBirth, address, workExperience, salary, skillIds } =
        req.body;

      if (!req.file || !req.file.filename) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Không tìm thấy file CV");
      }

      const cvUrl = req.file.filename;

      const candidateData = {
        userId: id,
        gender,
        dateOfBirth,
        address,
        cvUrl,
        workExperience,
        salary,
        skillIds,
      };

      const result = await userService.createCandidateProfile(
        candidateData,
        id
      );

      return resSuccess(res, null, result);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy ra danh sách người dùng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async getUsers(req, res) {
    try {
      const data = await userService.getUsers(req.query);
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Thêm mới người dùng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async updateUserByAdmin(req, res) {
    try {
      const { userId } = req.params;
      const data = await userService.updateUser(userId, req.body);
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Cập nhật nhà tuyển dụng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async updateEmployerProfile(req, res) {
    try {
      const { id } = req.params;
      const {
        companyName,
        companyAddress,
        companyWebsite,
        companyDescription,
        companySize,
        companyTaxCode,
      } = req.body;

      let avatar;

      if (req.file) {
        avatar = req.file.filename;
      }

      const updateData = {
        companyName,
        companyAddress,
        companyWebsite,
        companyDescription,
        companySize,
        companyTaxCode,
        companyLogo: avatar,
      };

      const result = await userService.updateEmployerProfile(id, updateData);

      return resSuccess(res, null, result);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Cập nhật ứng viên
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async updateCandidateProfile(req, res) {
    try {
      const { id } = req.params;

      // Lấy dữ liệu từ body request
      const candidateData = {};

      // Lọc và chỉ lấy các trường có giá trị
      const fields = [
        "skillsId",
        "address",
        "dateOfBirth",
        "gender",
        "salaryId",
        "workExperience",
      ];

      fields.forEach((field) => {
        if (req.body[field] !== undefined) {
          candidateData[field] = req.body[field];
        }
      });

      // Kiểm tra xem có file CV mới không
      if (req.file) {
        candidateData.cvUrl = req.file.filename;
      }

      const result = await userService.updateCandidateProfile(
        id,
        candidateData
      );

      return resSuccess(res, null, result);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Cập nhật trạng thái khóa người dùng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async setBlockStatus(req, res) {
    try {
      const { id } = req.params;
      const { isBlocked } = req.body;
      const data = await userService.setBlockStatus(id, isBlocked);
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }
}

module.exports = new UserController();
