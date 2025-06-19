const express = require("express");
const ensureAuthenticated = require("../Middlewares/Authentication");
const { getClassDetails, newClass } = require("../Controllers/ClassController");
const {
  getClassValidation,
  newClassValidation,
} = require("../Middlewares/classValidation");
const ClassRouter = express.Router();

ClassRouter.get(
  "/classDetails",
  ensureAuthenticated(["ADMIN", "HOD", "CLASS"]),
  getClassValidation,
  getClassDetails
);

ClassRouter.post(
  "/newClass",
  ensureAuthenticated(["ADMIN","HOD"]),
  newClassValidation,
  newClass
);

module.exports = ClassRouter;
