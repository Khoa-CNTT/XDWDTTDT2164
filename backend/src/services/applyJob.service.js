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
    console.log(parseResult);
    // Thêm mới dữ liệu vào data
    const newApplyJob = await db.Applications.create({
      jobId: applyJobData.jobId,
      candidateId: applyJobData.candidateId,
      cvUpload: applyJobData.cvUpload,
      coverLetter: applyJobData.coverLetter,
      matchScore: parseResult.matchScore,
      isSuitable: parseResult.isSuitable,
      moderatorReview: parseResult.moderateReview,
    });

    return newApplyJob;
  }

  /**
   * Lấy ra danh sách ứng viên ứng tuyển
   * @param {Object} jobId - ID công việc
   * @returns {Promise<void>} - Trả về danh sách ứng viên
   */
  async getCandidates(jobId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count: totalCandidates, rows: candidates } =
      await db.Applications.findAndCountAll({
        where: {
          jobId,
        },
        include: [
          {
            model: db.Candidates,
            as: "Candidates",
            attributes: ["id"],
            include: [
              {
                model: db.Users,
                as: "Users",
                attributes: ["fullName", "phoneNumber", "email"],
              },
            ],
          },
        ],
        attributes: [
          "id",
          "jobId",
          "candidateId",
          "status",
          "matchScore",
          "isSuitable",
        ],
        limit,
        offset,
      });

    return {
      page,
      limit,
      totalCandidates,
      candidates,
    };
  }

  /**
   * Xem chi tiết đánh giá và cv ứng viên
   * @param {Object} applyId - ID của ứng tuyển
   * @param {Object} candidateId - ID của ứng viên
   * @returns {Promise<void>} - Trả về thông tin chi tiết ứng viên
   */
  async getCandidateDetail(applyId) {
    const candidate = await db.Applications.findOne({
      where: {
        id: applyId,
      },
      include: [
        {
          model: db.Candidates,
          as: "Candidates",
          attributes: ["cvUrl"], // chỉ lấy những field cần thiết thôi
          include: [
            {
              model: db.Users,
              as: "Users",
              attributes: ["fullName", "phoneNumber", "email"],
            },
          ],
        },
      ],
    });

    return candidate;
  }
}

module.exports = new ApplyJobService();
