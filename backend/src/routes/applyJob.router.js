const express = require("express");
const {
  protectedRoute,
  authorizedRoute,
} = require("../middlewares/auth.middleware");
const applyJobsController = require("../controllers/applyJobs.controller");

const router = express.Router();

/**
 * @route   POST /apply-jobs/apply
 * @desc    Ứng tuyển một công việc
 * @access  Private
 */
router.post("/apply", protectedRoute, applyJobsController.applyJob);

/**
 * @route GET /apply-jobs/get-candidates/:jobId
 * @desc Lấy ra danh sách ứng tuyển cho một job
 * @access Private
 */
router.get(
  "/get-candidates/:jobId",
  protectedRoute,
  authorizedRoute("employer"),
  applyJobsController.getCandidates
);

/**
 * @route GET /apply-jobs/get-candidate/:applyId
 * @desc Lấy chi tiết ứng viên theo applyId
 * @access Private
 */
router.get(
  "/get-candidate/:applyId",
  protectedRoute,
  authorizedRoute("employer"),
  applyJobsController.getCandidateDetail
);

/**
 * @route GET /apply-jobs/get-job-apply/:candidateId
 * @desc Lấy danh sách bài đăng đã ứng tuyển
 * @access Private
 */
router.get(
  "/get-job-apply/:candidateId",
  protectedRoute,
  authorizedRoute("candidate"),
  applyJobsController.getJobApply
);

/**
 * @route PUT /apply-jobs/review-candidate/:applicationId
 * @desc Đánh giá ứng viên ứng tuyển
 * @access Private
 */
router.get(
  "/review-candidate/:applicationId",
  protectedRoute,
  authorizedRoute("employer"),
  applyJobsController.reviewCandidate
);

module.exports = router;
