const { resSuccess, resError } = require("../libs/response");
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
      const applyData = {
        jobId: req.body.jobId,
        candidateId: req.body.candidateId,
        cvUpload: req.file.filename,
        coverLetter: req.body.coverLetter,
      };
      const result = await applyJobService.applyJob(applyData);

      return resSuccess(res, "Ứng tuyển vào công việc thành công", result);
    } catch (error) {
      return resError(res, error);
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
      const { jobId } = req.params;
      const data = await applyJobService.getCandidates(jobId, req.query);
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
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
      const { applyId } = req.params;
      const data = await applyJobService.getCandidateDetail(applyId);

      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy danh sách công việc đã ứng tuyển
   * @param {req}
   * @param {res}
   * @returns {Promise<void>}
   */
  async getJobApply(req, res) {
    try {
      const { candidateId } = req.params;
      const data = await applyJobService.getJobApply(candidateId, req.query);
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Đánh giá ứng viên từ nhà tuyển dụng
   * @param {req}
   * @param {res}
   * @returns {Promise<void>}
   */
  async reviewCandidate(req, res) {
    try {
      const { applicationId } = req.params;
      const data = await applyJobService.reviewCandidate(
        applicationId,
        req.body
      );
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }
}

module.exports = new ApplyJobController();
