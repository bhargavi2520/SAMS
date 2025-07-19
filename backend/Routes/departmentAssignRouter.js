const express = require("express");
const ensureAuthenticated = require("../Middlewares/Authentication.js");
const {
  newAssignment,
  getAllHODs,
  getDepartmentAssignments,
  getAssignmentsByHOD,
  removeAssignment,
  updateAssignment,
} = require("../Controllers/DepartmentAssignmentController");
const DepartmentAssignmentRouter = express.Router();
const {
  departmentAssignmentValidation,
} = require("../Middlewares/DepartmentAssignmentValidation.js");

// Get all HODs
DepartmentAssignmentRouter.get(
  "/hods",
  ensureAuthenticated(["ADMIN"]),
  getAllHODs
);

// Get all department assignments
DepartmentAssignmentRouter.get(
  "/assignments",
  ensureAuthenticated(["ADMIN"]),
  getDepartmentAssignments
);

// Get assignments by HOD ID
DepartmentAssignmentRouter.get(
  "/assignments/hod/:hodId",
  ensureAuthenticated(["ADMIN"]),
  getAssignmentsByHOD
);

// Create new assignment
DepartmentAssignmentRouter.post(
  "/assign",
  ensureAuthenticated(["ADMIN"]),
  departmentAssignmentValidation,
  newAssignment
);

// Update assignment
DepartmentAssignmentRouter.put(
  "/assignments/:assignmentId",
  ensureAuthenticated(["ADMIN"]),
  departmentAssignmentValidation,
  updateAssignment
);

// Remove assignment
DepartmentAssignmentRouter.delete(
  "/assignments/:assignmentId",
  ensureAuthenticated(["ADMIN"]),
  removeAssignment
);

module.exports = DepartmentAssignmentRouter;
