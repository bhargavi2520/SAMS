const {
  User,
  Student,
  Admin,
  Faculty,
  HOD,
  ClassTeacher,
  Guest,
} = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
  try {
    const { email, password, role, profileData } = req.body;

    const roleModels = {
      STUDENT: Student,
      ADMIN: Admin,
      FACULTY: Faculty,
      HOD: HOD,
      CLASS_TEACHER: ClassTeacher,
      GUEST: Guest,
    };

    const UserModel = roleModels[role];
    if (!UserModel) {
      return res
        .status(400)
        .json({ message: "Invalid role specified", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password: hashedPassword,
      role,
      ...profileData,
    };

    const newUser = new UserModel(userData);
    await newUser.save();

    return generateTokenAndLogin(newUser, false, req, res);

  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      let message = `User with this ${duplicateField} already exists`;
      return res.status(400).json({ message, success: false });
    }
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const loginUser = async (req, res) => {

  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found", success: false });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ message: "Invalid Password", success: false });
  }

  return generateTokenAndLogin(user, rememberMe, req, res);
};


//login Helper function
const generateTokenAndLogin = async (user, rememberMe, req, res) => {
  try {
    const expiresIn = rememberMe ? "7d" : "24h";
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn,
      }
    );
    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
