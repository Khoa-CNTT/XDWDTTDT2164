const cron = require("node-cron");
const jobsService = require("../services/jobs.service");

cron.schedule("0 0 * * *", async () => {
  try {
    await jobsService.handleExpiredJobs();
  } catch (error) {
    console.error("[CRON] Lỗi khi kiểm tra bài đăng hết hạn:", error);
  }
});
