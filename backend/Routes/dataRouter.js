const express = require("express");
const DataRouter = express.Router();
const ensureAuthenticated = require("../Middlewares/Authentication.js");
const {
  getStudentDataByCriteria,
  getFaculties,
  createTimeTable,
  checkTimetableExists,
  getAssignedSubjectsAndFaculties,
  mySchedule,
  getStats,
} = require("../Controllers/DataController.js");
const {
  createTimeTableValidation,
} = require("../Middlewares/CreateTimeTableValidation.js");
const {
  getStudentAcademicDetails,
} = require("../Controllers/DashboardController.js");

DataRouter.get(
  "/students",
  ensureAuthenticated(["ADMIN", "HOD", "FACULTY"]),
  getStudentDataByCriteria
);
DataRouter.get(
  "/faculties",
  ensureAuthenticated(["ADMIN", "HOD"]),
  getFaculties
);

DataRouter.post(
  "/createTimeTable",
  ensureAuthenticated(["HOD", "ADMIN"]),
  createTimeTableValidation,
  createTimeTable
);

DataRouter.get(
  "/checkTimetable",
  ensureAuthenticated(["ADMIN", "HOD"]),
  checkTimetableExists
);

DataRouter.get(
  "/assignedSubjectsAndFaculties",
  ensureAuthenticated(["ADMIN", "HOD"]),
  getAssignedSubjectsAndFaculties
);

DataRouter.get("/mySchedule", ensureAuthenticated(["FACULTY"]), mySchedule);

DataRouter.get("/stats", ensureAuthenticated(["ADMIN"]), getStats);

DataRouter.get(
  "/student/academicDetails",
  ensureAuthenticated(["STUDENT"]),
  getStudentAcademicDetails
);

module.exports = DataRouter;
