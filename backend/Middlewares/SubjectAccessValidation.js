const { User } = require("../Models/User.js");
const Subject = require("../Models/Subject.js");
const departmentAssignment = require("../Models/AssignedDepartments.js");

/**
 * ---------NOT TESTED YET----------------------
 */
const checkAccess = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("-password -__v").lean();
    if (!user) {
      return res.status(404).json({
        message: "Account doesn't exist.",
        success: false,
      });
    }
    if (user.role == "ADMIN") {
      return next();
    }

    const assignedDepartmentsAndYear = await departmentAssignment
      .findOne({ hod: userId })
      .select("-__v")
      .lean();
    if (!assignedDepartmentsAndYear) {
      return res.status(404).json({
        message: "No Department and year is assigned to you",
        success: false,
      });
    }

    const { department, departmentYears } = assignedDepartmentsAndYear;
    let year, reqDepartment;

    if (req.body.department && req.body.year) {
      reqDepartment = req.body.department;
      year = req.body.year;
    } else if (req.body.subjectId) {
      const subject = await Subject.findOne({ _id: req.body.subjectId });
      if (!subject) {
        return res.status(404).json({
          message: "Subject not found",
          success: false,
        });
      }
      reqDepartment = subject.department;
      year = subject.year;
    } else {
      return res.status(400).json({
        message: "Insufficient data to validate access.",
        success: false,
      });
    }

    if (reqDepartment !== department) {
      return res.status(403).json({
        message: "You are not authorized to make changes in this department",
        success: false,
      });
    }

    if (!departmentYears.includes(year)) {
      return res.status(403).json({
        message:
          "You are not authorized to make changes in this department/year",
        success: false,
      });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message:
        "Internal Server Error occurred while validating subject access.",
      success: false,
    });
  }
};

module.exports = checkAccess;
