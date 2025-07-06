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

AuthRouter.get("/", (req, res) => {
  res.send("It is the Auth Router !");
});

AuthRouter.post("/login", loginValidation, loginUser);
AuthRouter.post("/register", registerValidation, registerUser);
AuthRouter.post("/logout", logout);

AuthRouter.get("/me", ensureAuthenticated(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    res.json({ user, success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

module.exports = AuthRouter;
