const express = require("express");
const ensureAuthenticated = require("../Middlewares/Authentication");
const {
  getAttendancebySubject,
} = require("../Controllers/AttendanceController");
const AttendanceRouter = express.Router();

AttendanceRouter.get(
  "/attendancebySubject",
  ensureAuthenticated([]),
  getAttendancebySubject
);

module.exports = AttendanceRouter;
