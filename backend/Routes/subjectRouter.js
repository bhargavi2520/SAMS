const express = require("express");
const SubjectRouter = express.Router();
const ensureAuthenticated = require("../Middlewares/Authentication");
const {
  getSubjectsbyCriteria,
  addSubject,
  assignSubject,
} = require("../Controllers/SubjectController");
const {
  getSubjectsValidation,
  addSubjectValidation,
  assignSubjectValidation,
} = require("../Middlewares/SubjectValidation");

SubjectRouter.get("/", (req, res) => {
  res.send("It is the Subject Router!");
});

SubjectRouter.get(
  "/subjects",
  ensureAuthenticated([]),
  getSubjectsValidation,
  getSubjectsbyCriteria
);

SubjectRouter.post(
  "/addSubject",
  ensureAuthenticated(["HOD"]),
  addSubjectValidation,
  addSubject
);
SubjectRouter.post(
  "/assignSubject",
  ensureAuthenticated(["HOD", "ADMIN"]),
  assignSubjectValidation,
  assignSubject
);

module.exports = SubjectRouter;
