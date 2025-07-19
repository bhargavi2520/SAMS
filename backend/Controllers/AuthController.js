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
const classInfo = require("../Models/Class");

/**
 * Register user Function
 * Logs in the user after registration
 */
const registerUser = async (req, res) => {
  try {
    const { email, password, role, profileData } = req.body;

    const roleModels = {
      STUDENT: Student,
      FACULTY: Faculty,
      ADMIN: Admin,
      HOD: HOD,
      GUEST: Guest,
    };

    const UserModel = roleModels[role];
    if (!UserModel) {
      return res
        .status(400)
        .json({ message: "Invalid role specified", success: false });
    }
    const orConditions = [{ email }];
    if (profileData.rollNumber)
      orConditions.push({ rollNumber: profileData.rollNumber });
    if (profileData.aparId) orConditions.push({ aparId: profileData.aparId });
    const existingUser = await User.findOne({ $or: orConditions });

    let message = "User already exists with the same email";
    if (role == "STUDENT")
      message =
        "User already exists with the same email or roll number or aparId";

    if (existingUser) {
      return res.status(400).json({
        message,
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let admissionYear;
    let batch;
    if (role === "STUDENT") {
      let lateralEntry;
      if (profileData.lateralEntry) lateralEntry = profileData.lateralEntry;

      admissionYear = new Date(
        profileData.admission_academic_year
      ).getFullYear();

      if (lateralEntry) {
        admissionYear -= 1;
      }
      batch = admissionYear;
    }

    const userData = {
      email,
      password: hashedPassword,
      role,
      ...profileData,
      ...(role === "STUDENT" && { batch }),
    };

    const newUser = new UserModel(userData);
    await newUser.save();
    if (role === "STUDENT") {
      const { department, year, section } = profileData;
      const classDocument = await classInfo.findOne({
        department,
        year,
        section,
        batch,
      });
      if (classDocument) {
        classDocument.students.push({ student: newUser._id });
        await classDocument.save();
      }
    }
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

/**
 * Login Function
 * Valid User can login and will get the essential profile data
 */
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

/**
 * Login helper function
 * being called in login and Register function
 */
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
    // Convert mongoose doc to plain object and remove password
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.__v;

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: userObj,
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
