const express = require("express");
const ensureAuthenticated = require("../Middlewares/Authentication.js");
const {
  newAssignment,
} = require("../Controllers/DepartmentAssignmentController");
const DepartmentAssignmentRouter = express.Router();
const {
  departmentAssignmentValidation,
} = require("../Middlewares/DepartmentAssignmentValidation.js");

DepartmentAssignmentRouter.post(
  "/assign",
  ensureAuthenticated(["ADMIN"]),
  departmentAssignmentValidation,
  newAssignment
);

module.exports = DepartmentAssignmentRouter;
