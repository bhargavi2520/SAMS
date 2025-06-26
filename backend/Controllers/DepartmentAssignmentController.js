const departmentAssignment = require("../Models/AssignedDepartments.js");
const classInfo = require("../Models/Class.js");
const { User } = require("../Models/User.js");

const newAssignment = async (req, res) => {
  const { hodId, department, year } = req.body;
  try {
    const hod = await User.findById(hodId).select("-__v -password").lean();
    if (!hod) {
      return res.status(404).json({
        message: "Hod doesn't exist",
        success: false,
      });
    }

    const doExist = await classInfo
      .find({ department, year })
      .select("-subjects -students -__v")
      .lean();
    if (doExist.length == 0) {
      return res.status(404).json({
        message: "Requested department and year doesn't exist",
        success: false,
      });
    }

    const assignment = new departmentAssignment({
      hod: hodId,
      department,
      departmentYears : year,
    });

    await assignment.save();
    return res.status(201).json({
      message: "Department Assigned Successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Occurred while assigning department",
      success: false,
    });
  }
};

module.exports = { newAssignment };
