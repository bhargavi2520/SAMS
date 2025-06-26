const express = require("express");
const ensureAuthenticated = require("../Middlewares/Authentication.js");
const {
  newAssignment,
} = require("../Controllers/DepartmentAssignmentController");
const DepartmentAssignmentRouter = express.Router();

DepartmentAssignmentRouter.post(
  "/assign",
  ensureAuthenticated(["ADMIN"]),
  newAssignment
);

module.exports = DepartmentAssignmentRouter;