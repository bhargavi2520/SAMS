const express = require("express");
const ensureAuthenticated = require("../Middlewares/Authentication");
const {
  getAttendancebySubject,
  markAttendance,
} = require("../Controllers/AttendanceController");
const {
  getAttendanceBySubjectValidation,
  markAttendanceValidation,
} = require("../Middlewares/AttendanceValidation");
const AttendanceRouter = express.Router();

AttendanceRouter.get(
  "/attendancebySubject",
  ensureAuthenticated([]),
  getAttendanceBySubjectValidation,
  getAttendancebySubject
);

AttendanceRouter.post(
  "/mark",
  ensureAuthenticated(["FACULTY"]),
  markAttendanceValidation,
  markAttendance
);

module.exports = AttendanceRouter;
