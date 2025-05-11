const db = require("../models");
const { Op } = require("sequelize");

class DashboardService {
  async getDashboardOverview() {
    const [jobCount, candidateCount, employerCount] = await Promise.all([
      db.Jobs.count(),
      db.Users.count({ where: { role: "candidate" } }),
      db.Users.count({ where: { role: "employer" } }),
    ]);

    return { jobCount, candidateCount, employerCount };
  }

  async getPaymentOverview() {
    const now = new Date();

    // Bắt đầu ngày hôm nay
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // Bắt đầu tháng này
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Bắt đầu tháng sau (để làm điều kiện <)
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const [paymentNowSum, paymentMonthSum, paymentCount, walletSum] =
      await Promise.all([
        db.Payments.sum("amount", {
          where: {
            createdAt: {
              [Op.gte]: startOfToday,
            },
          },
        }),
        db.Payments.sum("amount", {
          where: {
            createdAt: {
              [Op.gte]: startOfMonth,
              [Op.lt]: startOfNextMonth,
            },
          },
        }),
        db.Payments.count(),
        db.Payments.sum("amount", { where: { transactionType: "Nạp tiền" } }),
      ]);

    return {
      todayRevenue: paymentNowSum || 0,
      thisMonthRevenue: paymentMonthSum || 0,
      totalTransactions: paymentCount,
      totalWalletBalance: walletSum || 0,
    };
  }
}

module.exports = new DashboardService();
