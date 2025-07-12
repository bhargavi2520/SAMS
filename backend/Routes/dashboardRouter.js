const express = require("express");
const ensureAuthenticated = require("../Middlewares/Authentication");
const {
  getStudentDashboard,
  getFacultyDashboard,
  getHodDashboard,
} = require("../Controllers/DashboardController");
const DashboardRouter = express.Router();

DashboardRouter.get(
  "/student",
  ensureAuthenticated(["STUDENT"]),
  getStudentDashboard
);

DashboardRouter.get(
  "/faculty",
  ensureAuthenticated(["FACULTY"]),
  getFacultyDashboard
);

DashboardRouter.get("/hod",
  ensureAuthenticated(["HOD"]),
  getHodDashboard
);

module.exports = DashboardRouter;
