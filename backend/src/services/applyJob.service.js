const ApiError = require("../libs/apiError");
const { StatusCode } = require("../libs/enum");
const { moderateApplyJob } = require("../libs/geminiClient");
const { convertPdfToText, parseGeminiResult } = require("../libs/helper");
const db = require("../models");

/**
 * Service xử lý nghiệp vụ liên quan đến ứng tuyển
 */
class ApplyJobService {
  /**
   * Ứng tuyển vào một công việc
   * @param {Object} applyJobData - Dữ liệu ứng tuyển
   * @returns {Promise<void>} - Trả về thông tin đã ứng tuyển
   */
  async applyJob(applyJobData) {
    // Kiểm tra ứng viên này đã ứng tuyển chưa
    const applyJobCandidateExist = await db.Applications.findOne({
      where: {
        jobId: applyJobData.jobId,
        candidateId: applyJobData.candidateId,
      },
    });

    if (applyJobCandidateExist) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Bạn đã ứng tuyển vào công việc này"
      );
    }

    // Chuyển đổi file pdf sang text
    let cvText = "";
    if (applyJobData.cvUpload) {
      cvText = await convertPdfToText(applyJobData.cvUpload);
    } else {
      const candidate = await db.Candidates.findByPk(applyJobData.candidateId);
      if (!candidate || !candidate.cvUrl) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Không tìm thấy CV ứng viên để đánh giá"
        );
      }
      cvText = await convertPdfToText(candidate.cvUrl);
    }

    // Gọi gemini để đánh giá ứng viên từ nội dung cv
    const job = await db.Jobs.findByPk(applyJobData.jobId);
    const aiResult = await moderateApplyJob(cvText, job);
    const parseResult = parseGeminiResult(aiResult);
    // Thêm mới dữ liệu vào data
    const newApplyJob = await db.Applications.findOne({
      jobId: applyJobData.jobId,
      candidateId: applyJobData.candidateId,
      cvUpload: applyJobData.cvUpload,
      matchScore: parseResult.matchScore,
      isSuitable: parseResult.isSuitable,
      coverLetter: parseResult.coverLetter,
    });

    return newApplyJob;
  }
}

module.exports = new ApplyJobService();
