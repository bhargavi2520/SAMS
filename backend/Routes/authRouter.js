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
  uploadImage,
  deleteImage,
  getProfile,
} = require("../Controllers/AuthController.js");
const ensureAuthenticated = require("../Middlewares/Authentication.js");

AuthRouter.get("/", (req, res) => {
  res.send("It is the Auth Router !");
});

AuthRouter.post("/login", loginValidation, loginUser);
AuthRouter.post("/register", registerValidation, registerUser);

AuthRouter.get("/me", ensureAuthenticated([]), getProfile);

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

AuthRouter.put(
  "/profile-photo",
  ensureAuthenticated([]),
  upload.single("profilePhoto"),
  uploadImage
);

AuthRouter.delete("/profile-photo", ensureAuthenticated([]), deleteImage);

AuthRouter.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).send("Image size should not exceed 2 MB.");
  }
  res.status(500).send("Server error");
});

module.exports = AuthRouter;
