const express = require("express");
const AuthRouter = express.Router();
const { User } = require("../Models/User.js");
const {
  registerValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation.js");
const {
  registerUser,
  loginUser,
  logout,
} = require("../Controllers/AuthController.js");
const ensureAuthenticated = require("../Middlewares/Authentication.js");

const roleFields = {
  Student: [
    "role",
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "aparId",
    "admission_academic_year",
    "dateOfBirth",
    "semester",
    "year",
    "section",
    "department",
    "transport",
    "busRoute",
    "address",
    "parentPhoneNumber",
  ],
  Faculty: ["role", "firstName", "lastName", "email", "phoneNumber"],
  Admin: ["firstName", "lastName", "email", "role"],
  HOD: ["firstName", "lastName", "email", "role"],
};

AuthRouter.get("/", (req, res) => {
  res.send("It is the Auth Router !");
});

AuthRouter.post("/login", loginValidation, loginUser);
AuthRouter.post("/register", registerValidation, registerUser);
AuthRouter.post("/logout", logout);

module.exports = AuthRouter;
