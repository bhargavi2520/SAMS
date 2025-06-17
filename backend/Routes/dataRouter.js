const express = require("express");
const DataRouter = express.Router();
const ensureAuthenticated = require("../Middlewares/Authentication.js");
const {
  getStudentDataByCriteria,
  getFaculties,
  getFacultyDashboard,
  getSubjectFacultyInfo,
  getStudentSchedule,
} = require("../Controllers/DataController.js");

DataRouter.get(
  "/students",
  ensureAuthenticated(["Admin", "HOD", "Faculty"]),
  getStudentDataByCriteria
);
DataRouter.get(
  "/faculties",
  ensureAuthenticated(["Admin", "HOD"]),
  getFaculties
);

DataRouter.get(
  "/facultyDash",
  ensureAuthenticated(["FACULTY"]),
  getFacultyDashboard
);

// for student dashboard
DataRouter.get(
  "/subjectFaculties",
  ensureAuthenticated([]),
  getSubjectFacultyInfo
);

DataRouter.get(
  "/student/schedule",
  ensureAuthenticated([]),
  getStudentSchedule
);

module.exports = DataRouter;
