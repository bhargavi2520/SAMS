const express = require("express");
const DataRouter = express.Router();
const ensureAuthenticated = require("../Middlewares/Authentication.js");
const {
  getStudentDataByCriteria,
  getFaculties,
  getFacultyDashboard,
  getSubjectFacultyInfo,
  getStudentSchedule,
  createTimeTable,
} = require("../Controllers/DataController.js");

DataRouter.get(
  "/students",
  ensureAuthenticated(["Admin", "HOD", "FACULTY"]),
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


DataRouter.post(
  "/newSchedule",
  ensureAuthenticated(["HOD", "ADMIN"]),
  createTimeTable
);

module.exports = DataRouter;
