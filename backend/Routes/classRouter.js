const express = require("express");
const ensureAuthenticated = require("../Middlewares/Authentication");
const {
  getClassDetails,
  newClass,
  bulkCreateClasses,
} = require("../Controllers/ClassController");
const {
  getClassValidation,
  newClassValidation,
} = require("../Middlewares/classValidation");
const ClassRouter = express.Router();

ClassRouter.get(
  "/classDetails",
  ensureAuthenticated(["ADMIN", "HOD", "FACULTY"]),
  getClassValidation,
  getClassDetails
);

ClassRouter.post(
  "/newClass",
  ensureAuthenticated(["ADMIN", "HOD"]),
  newClassValidation,
  newClass
);

ClassRouter.post(
  "/createBulkClasses",
  ensureAuthenticated(["ADMIN"]),
  bulkCreateClasses
);

module.exports = ClassRouter;
