const { default: mongoose } = require("mongoose");
const classInfo = require("../Models/Class");

/**
 * function for getting class details for a specific batch , department and year 
 * it returns class details along the all subject and students for this class.
 */
const getClassDetails = async (req, res) => {
  const { batch, department, section } = req.query;

  try {
    const classDetails = await classInfo
      .findOne({
        batch: batch,
        department: department,
        section: section,
      })
      .select("-__v")
      .populate({
        path: "subjects.subject",
        select: "name code",
      })
      .populate({
        path: "students.student",
        select: "firstName lastName",
      });

    if (!classDetails) {
      return res.status(404).json({
        success: false,
        message: "No details found for given criteria",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Class Details fetched successfully",
      classDetails: classDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Occurred while fetching classDetails",
    });
  }
};

/**
 * function for creating new class only can be created by Admin or HOD
 * it checks if database have no existing class with same batch , department and section
 * returns a new created class for the details entered
 */
const newClass = async (req, res) => {
  const { department, year, batch, section } = req.body;
  try {
    const existingClass = await classInfo.findOne({
      batch: batch,
      department: department,
      section: section,
    });

    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: "Class with same details already exists",
      });
    }

    const newClass = new classInfo({
      department: department,
      batch: batch,
      year: year,
      section: section,
    });

    await newClass.save();

    return res.status(201).json({
      success: true,
      message: "New class created successfully",
      classDetails: {
        department: department,
        batch: batch,
        year: year,
        section: section,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Occurred while adding Class",
    });
  }
};

module.exports = {
  getClassDetails,
  newClass,
};
