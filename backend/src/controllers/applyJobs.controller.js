const { StatusCode, ResponseStatus } = require("../libs/enum");
const applyJobService = require("../services/applyJob.service");

/**
 * Controller xử lý logic ứng tuyển
 */
class ApplyJobController {
  /**
   * Ứng tuyển vào công việc
   * @param {req}
   * @param {res}
   * @returns {Promise<void>}
   */
  async applyJob(req, res) {
    try {
      const result = await applyJobService.applyJob(req.body);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: result,
        message: "Ứng tuyển vào công việc này thành công",
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
   * Lấy ra danh sách ứng viên ứng tuyển
   * @param {req}
   * @param {res}
   * @returns {Promise<void>}
   */
  async getCandidates(req, res) {
    try {
      const { jobId } = req.param;
      const data = await applyJobService.getCandidates(jobId, query);
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
   * Xem chi tiết đánh giá và cv ứng viên
   * @param {req}
   * @param {res}
   * @returns {Promise<void>}
   */
  async getCandidateDetail(req, res) {
    try {
      const { applyId, candidateId } = req.param;
      const data = await applyJobService.getCandidateDetail(
        applyId,
        candidateId
      );

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
}

module.exports = new ApplyJobController();
