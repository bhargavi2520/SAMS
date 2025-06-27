const express = require("express");
const DataRouter = express.Router();
const ensureAuthenticated = require("../Middlewares/Authentication.js");
const {
  getStudentDataByCriteria,
  getFaculties,
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

DataRouter.post(
  "/newSchedule",
  ensureAuthenticated(["HOD", "ADMIN"]),
  createTimeTable
);

module.exports = DataRouter;
