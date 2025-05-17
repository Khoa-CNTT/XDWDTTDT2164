const ApiError = require("../libs/apiError");
const { StatusCode } = require("../libs/enum");
const { moderateApplyJob } = require("../libs/geminiClient");
const { convertPdfToText, parseGeminiResult } = require("../libs/helper");
const { sendMailToCandidate } = require("../libs/sendMail");
const db = require("../models");
const path = require("path");

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
    // Kiểm tra dữ liệu đầu vào
    if (!applyJobData || !applyJobData.jobId || !applyJobData.candidateId) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Thiếu jobId hoặc candidateId"
      );
    }

    // Kiểm tra ứng viên đã ứng tuyển chưa
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

    // Tìm ứng viên và thông tin người dùng
    const candidate = await db.Candidates.findByPk(applyJobData.candidateId, {
      include: [
        {
          model: db.Users,
          as: "Users",
          attributes: ["email", "fullName"],
        },
      ],
    });
    if (!candidate) {
      throw new ApiError(StatusCode.NOT_FOUND, "Không tìm thấy ứng viên");
    }

    // Xử lý CV
    let cvText = "";
    if (applyJobData.cvUpload) {
      if (!applyJobData.cvUpload.endsWith(".pdf")) {
        throw new ApiError(StatusCode.BAD_REQUEST, "CV phải là file PDF");
      }
      try {
        const cvPath = path.join(
          __dirname,
          "../uploads",
          applyJobData.cvUpload
        );
        cvText = await convertPdfToText(cvPath); // ✅ Đúng
      } catch (error) {
        throw new ApiError(
          StatusCode.INTERNAL_SERVER_ERROR,
          "Lỗi khi xử lý CV: " + error.message
        );
      }
    } else {
      if (!candidate.cvUrl) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Không tìm thấy CV ứng viên để đánh giá"
        );
      }
      try {
        cvText = await convertPdfToText(candidate.cvUrl);
      } catch (error) {
        throw new ApiError(
          StatusCode.INTERNAL_SERVER_ERROR,
          "Lỗi khi xử lý CV: " + error.message
        );
      }
    }

    // Tìm công việc
    const job = await db.Jobs.findByPk(applyJobData.jobId, {
      attributes: ["id", "jobName", "address", "expire", "applyCount"],
      include: [
        {
          model: db.Employers,
          as: "Employers",
          attributes: ["companyName"],
        },
      ],
    });
    if (!job) {
      throw new ApiError(StatusCode.NOT_FOUND, "Công việc không tồn tại");
    }

    // Đánh giá AI
    let parseResult;
    try {
      const aiResult = await moderateApplyJob(cvText, job);
      parseResult = parseGeminiResult(aiResult);
      console.log(parseResult);
      if (!parseResult || typeof parseResult.matchScore !== "number") {
        throw new Error("Kết quả AI không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi khi gọi AI:", error.message);
      parseResult = {
        matchScore: 0,
        isSuitable: false,
        moderateReview: "Lỗi AI",
      };
    }

    // Sử dụng giao dịch để đảm bảo tính nhất quán
    const transaction = await db.sequelize.transaction();
    try {
      console.log(
        `Ứng tuyển: candidateId=${applyJobData.candidateId}, jobId=${applyJobData.jobId}`
      );
      const newApplyJob = await db.Applications.create(
        {
          jobId: applyJobData.jobId,
          candidateId: applyJobData.candidateId,
          cvUpload: applyJobData.cvUpload,
          coverLetter: applyJobData.coverLetter,
          matchScore: parseResult.matchScore,
          isSuitable: parseResult.isSuitable,
          moderatorReview: parseResult.moderateReview,
        },
        { transaction }
      );

      job.applyCount = (job.applyCount || 0) + 1;
      await job.save({ transaction });

      await transaction.commit();
      console.log(`Ứng tuyển thành công, applyCount=${job.applyCount}`);

      // Gửi email bất đồng bộ
      sendMailToCandidate(candidate.Users.email, candidate.Users.fullName, {
        jobName: job.jobName,
        address: job.address,
        expire: job.expire,
        Employers: { companyName: job.Employers.companyName },
      }).catch((error) => {
        console.error("Lỗi gửi email:", error.message);
      });

      return newApplyJob;
    } catch (error) {
      await transaction.rollback();
      console.error("Lỗi khi ứng tuyển:", error.message);
      throw error instanceof ApiError
        ? error
        : new ApiError(
            StatusCode.INTERNAL_SERVER_ERROR,
            "Lỗi khi xử lý ứng tuyển"
          );
    }
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

    candidate.status = "Đã xem";
    await candidate.save();

    return candidate;
  }

  /**
   * Lấy danh sách sách công việc đã ứng tuyển
   * @param {string} userId - ID người dùng
   * @returns {Promise<void>} - Trả về danh sách công việc đã ứng tuyển
   */
  async getJobApply(candidateId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;
    const { count: totalJobs, rows: jobs } =
      await db.Applications.findAndCountAll({
        where: { candidateId },
        include: [
          {
            model: db.Jobs,
            as: "Jobs",
            include: [
              {
                model: db.Employers,
                as: "Employers",
              },
            ],
          },
          {
            model: db.Candidates,
            as: "Candidates",
          },
        ],
        limit,
        offset,
      });
    return { page, limit, totalJobs, jobs };
  }

  /**
   * Đánh giá ứng viên từ nhà tuyển dụng
   * @param {string} applicationId
   * @param {string} data
   * @returns {Promise<void>} - Trả về thông báo đánh giá ứng viên thành công
   */
  async reviewCandidate(applicationId, data) {
    const application = await db.Applications.findOne({
      where: { id: applicationId },
    });

    application.employerReview = data;
    await application.save();

    return application;
  }
}

module.exports = new ApplyJobService();
