const express = require("express");
const AuthRouter = express.Router();
const { User } = require("../Models/User.js");
const {
  registerValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation.js");
const { registerUser, loginUser } = require("../Controllers/AuthController.js");
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

AuthRouter.get("/userData", ensureAuthenticated([]), async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({
      message: "User ID not found in request",
      success: false,
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  const fields = roleFields[user.role] || roleFields.default;
  const userData = {};
  fields.forEach((field) => {
    userData[field] = user[field];
  });

  res.status(200).json({
    message: "User Data Fetched Successfully",
    user: userData,
    success: true,
  });
});

module.exports = AuthRouter;
