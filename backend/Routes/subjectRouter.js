const express = require("express");
const SubjectRouter = express.Router();
const ensureAuthenticated = require("../Middlewares/Authentication");
const {
  getSubjectsbyCriteria,
  addSubject,
  assignSubject,
  deleteSubjectAssignment,
} = require("../Controllers/SubjectController");
const {
  getSubjectsValidation,
  addSubjectValidation,
  assignSubjectValidation,
} = require("../Middlewares/SubjectValidation");
const checkAccess = require("../Middlewares/SubjectAccessValidation");

SubjectRouter.get("/", (req, res) => {
  res.send("It is the Subject Router!");
});

SubjectRouter.get("/subjects", ensureAuthenticated([]), getSubjectsbyCriteria);

SubjectRouter.post(
  "/addSubject",
  ensureAuthenticated(["HOD"]),
  addSubjectValidation,
  checkAccess,
  addSubject
);
SubjectRouter.post(
  "/assignments/add",
  ensureAuthenticated(["HOD", "ADMIN"]),
  assignSubjectValidation,
  checkAccess,
  assignSubject
);
SubjectRouter.delete(
  "/assignments/delete",
  ensureAuthenticated(["HOD", "ADMIN"]),
  deleteSubjectAssignment
);

module.exports = SubjectRouter;
