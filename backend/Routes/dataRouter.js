const express = require("express");
const DataRouter = express.Router();
const ensureAuthenticated = require("../Middlewares/Authentication.js");
const {
  getStudentDatabyCriteria,
  getFaculties,
  getFacultyDashboard,
  getSubjectFacultyInfo,
} = require("../Controllers/DataController.js");

DataRouter.get(
  "/students",
  ensureAuthenticated(["Admin", "HOD", "Faculty"]),
  getStudentDatabyCriteria
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

module.exports = DataRouter;
