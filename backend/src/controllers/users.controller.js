const userService = require("../services/users.service");
const { StatusCode, ResponseStatus } = require("../libs/enum");
const ApiError = require("../libs/apiError");

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
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
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

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Email đã được gửi đến người dùng",
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
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

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Mật khẩu đã được đặt lại thành công",
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
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

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Mật khẩu đã được thay đổi thành công",
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
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
        companyLogo: avatar,
      };

      await userService.createEmployerProfile(id, updateData);

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Thông tin nhà tuyển dụng đã được cập nhật thành công",
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
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
      await userService.approveEmployer(employerId);

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Công ty đã được duyệt thành công",
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
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
      const { employerId } = req.user;

      const employer = await userService.getEmployerProfile(employerId);

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: employer,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
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
      const { page, limit, search } = req.query;

      const employers = await userService.getEmployerList({
        page,
        limit,
        search,
      });

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: employers,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
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
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
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
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
    }
  }

  /**
   * Thêm nhân viên vào công ty
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async addEmployeeToEmployer(req, res) {
    try {
      const { employerId } = req.params;
      const { email, fullName, phoneNumber, address } = req.body;

      await userService.addEmployeeToEmployer(employerId, {
        email,
        fullName,
        phoneNumber,
        address,
      });

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Nhân viên đã được thêm vào công ty thành công",
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
    }
  }

  /**
   * Lấy danh sách nhân viên của nhà tuyển dụng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} - Response object
   */
  async getEmployerEmployees(req, res) {
    try {
      const { employerId } = req.params;

      const employees = await userService.getEmployerEmployees(employerId);

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: employees,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
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

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
    }
  }
}

module.exports = new UserController();
