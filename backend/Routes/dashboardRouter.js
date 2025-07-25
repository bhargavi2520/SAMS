const express = require("express");
const ensureAuthenticated = require("../Middlewares/Authentication");
const {
  getStudentDashboard,
  getFacultyDashboard,
  getHodDashboard,
  getAdminDashboard,
} = require("../Controllers/DashboardController");
const tokenRefresher = require("../Middlewares/TokenRefresher");
const DashboardRouter = express.Router();

DashboardRouter.get(
  "/student",
  ensureAuthenticated(["STUDENT"]),
  tokenRefresher,
  getStudentDashboard
);

DashboardRouter.get(
  "/faculty",
  ensureAuthenticated(["FACULTY"]),
  tokenRefresher,
  getFacultyDashboard
);

DashboardRouter.get(
  "/hod",
  ensureAuthenticated(["HOD"]),
  tokenRefresher,
  getHodDashboard
);

DashboardRouter.get(
  "/admin",
  ensureAuthenticated(["ADMIN"]),
  tokenRefresher,
  getAdminDashboard
);

module.exports = DashboardRouter;
