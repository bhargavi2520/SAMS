const express = require("express");
const ensureAuthenticated = require("../Middlewares/Authentication");
const { getStudentDashboard } = require("../Controllers/DashboardController");
const DashboardRouter = express.Router();

DashboardRouter.get(
  "/student",
  ensureAuthenticated(["STUDENT"]),
  getStudentDashboard
);

module.exports = DashboardRouter;
