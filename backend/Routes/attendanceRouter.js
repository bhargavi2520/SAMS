const express = require("express");
const ensureAuthenticated = require("../Middlewares/Authentication");
const {
  getAttendancebySubject,
  markAttendance,
} = require("../Controllers/AttendanceController");
const AttendanceRouter = express.Router();

AttendanceRouter.get(
  "/attendancebySubject",
  ensureAuthenticated([]),
  getAttendancebySubject
);

AttendanceRouter.post(
  "/mark",
  ensureAuthenticated(["FACULTY"]),
  markAttendance
);

module.exports = AttendanceRouter;
