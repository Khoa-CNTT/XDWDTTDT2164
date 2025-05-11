const express = require("express");
const {
  protectedRoute,
  authorizedRoute,
} = require("../middlewares/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

const router = express.Router();

router.get(
  "/get-overview",
  protectedRoute,
  authorizedRoute("admin"),
  dashboardController.getDashboardOverview
);

router.get(
  "/get-payment-overview",
  protectedRoute,
  authorizedRoute("admin"),
  dashboardController.getPaymentOverview
);

module.exports = router;
