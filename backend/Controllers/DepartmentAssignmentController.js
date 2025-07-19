const departmentAssignment = require("../Models/AssignedDepartments.js");
const classInfo = require("../Models/Class.js");
const { User, HOD } = require("../Models/User.js");

const newAssignment = async (req, res) => {
  const { hodId, department, year } = req.body;
  try {
    const hod = await User.findById(hodId).select("-__v -password").lean();
    if (!hod) {
      return res.status(404).json({
        message: "HOD doesn't exist",
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

    // Check if HOD is already assigned to this department and year
    const existingAssignment = await departmentAssignment.findOne({
      hod: hodId,
      department,
      departmentYears: year,
    });

    if (existingAssignment) {
      return res.status(400).json({
        message: "HOD is already assigned to this department and year",
        success: false,
      });
    }

    const assignment = new departmentAssignment({
      hod: hodId,
      department,
      departmentYears: year,
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

// Get all HODs
const getAllHODs = async (req, res) => {
  try {
    const hods = await HOD.find().select("-__v -password").lean();
    return res.status(200).json({
      message: "HODs fetched successfully",
      success: true,
      hods: hods,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error while fetching HODs",
      success: false,
    });
  }
};

// Get all department assignments
const getDepartmentAssignments = async (req, res) => {
  try {
    const assignments = await departmentAssignment
      .find()
      .populate("hod", "firstName lastName email")
      .lean();

    return res.status(200).json({
      message: "Department assignments fetched successfully",
      success: true,
      assignments: assignments,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error while fetching department assignments",
      success: false,
    });
  }
};

// Get assignments by HOD ID
const getAssignmentsByHOD = async (req, res) => {
  const { hodId } = req.params;
  try {
    const assignments = await departmentAssignment
      .find({ hod: hodId })
      .populate("hod", "firstName lastName email")
      .lean();

    return res.status(200).json({
      message: "HOD assignments fetched successfully",
      success: true,
      assignments: assignments,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error while fetching HOD assignments",
      success: false,
    });
  }
};

// Remove department assignment
const removeAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const assignment = await departmentAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
        success: false,
      });
    }

    await departmentAssignment.findByIdAndDelete(assignmentId);
    return res.status(200).json({
      message: "Department assignment removed successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error while removing assignment",
      success: false,
    });
  }
};

// Update department assignment
const updateAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const { department, year } = req.body;
  try {
    const assignment = await departmentAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
        success: false,
      });
    }

    // Check if the new department and year combination exists
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

    // Check if HOD is already assigned to this department and year (excluding current assignment)
    const existingAssignment = await departmentAssignment.findOne({
      hod: assignment.hod,
      department,
      departmentYears: year,
      _id: { $ne: assignmentId },
    });

    if (existingAssignment) {
      return res.status(400).json({
        message: "HOD is already assigned to this department and year",
        success: false,
      });
    }

    assignment.department = department;
    assignment.departmentYears = year;
    await assignment.save();

    return res.status(200).json({
      message: "Department assignment updated successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error while updating assignment",
      success: false,
    });
  }
};

module.exports = { 
  newAssignment, 
  getAllHODs, 
  getDepartmentAssignments, 
  getAssignmentsByHOD, 
  removeAssignment, 
  updateAssignment 
};
