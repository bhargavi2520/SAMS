const express = require("express");
const ensureAuthenticated = require("../Middlewares/Authentication");
const {
  getSubjectsbyCriteria,
  addSubject,
  assignSubject,
} = require("../Controllers/SubjectController");
const SubjectRouter = express.Router();

SubjectRouter.get("/", (req, res) => {
  res.send("It is the Subject Router!");
});

SubjectRouter.get("/subjects", ensureAuthenticated([]), getSubjectsbyCriteria);

SubjectRouter.post("/addSubject", ensureAuthenticated(["HOD"]), addSubject);
SubjectRouter.post(
  "/assignSubject",
  ensureAuthenticated(["HOD", "ADMIN"]),
  assignSubject
);

module.exports = SubjectRouter;
