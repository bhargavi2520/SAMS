const Subject = require("../Models/Subject.js");
const { User } = require("../Models/User.js");
const AssignedSubject = require("../Models/AssignedSubjects.js");

const getSubjectsbyCriteria = async (req, res) => {
  const { department, year, semester } = req.query;
  try {
    const query = {};
    if (department) query.department = department;
    if (year) query.year = year;
    if (semester) query.semester = semester;

    const subjects = await Subject.find(query).select("-__v");
    if (subjects.length === 0) {
      return res.status(404).json({
        message: "No subjects found matching the criteria",
        success: false,
      });
    }
    res.status(200).json({
      message: "Subjects fetched successfully",
      subjects,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const addSubject = async (req, res) => {
  const { name, code, department, year, semester } = req.body;
  try {
    const newSubject = new Subject({
      name,
      code,
      department,
      year,
      semester,
    });
    await newSubject.save();
    res.status(201).json({
      message: "Subject added successfully",
      subject: newSubject,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const assignSubject = async (req, res) => {
  const { subjectId, facultyId, section } = req.body;
  try {
    const subject = await Subject.findOne({ _id: subjectId });
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
        success: false,
      });
    }
    const faculty = await User.findOne({ _id: facultyId });
    if (!faculty) {
      return res.status(404).json({
        message: "Teacher not found",
        success: false,
      });
    }
    const existingAssignment = await AssignedSubject.findOne({
      subject: subject._id,
      faculty: faculty._id,
      section: section ? section : 1,
    });
    if (existingAssignment) {
      return res.status(400).json({
        message: "This subject is already assigned to the faculty",
        success: false,
      });
    }
    const newAssignment = new AssignedSubject({
      subject: subject._id,
      faculty: faculty._id,
      section: section ? section : 1,
    });

    await newAssignment.save();
    res.status(201).json({
      message: "Subject assigned successfully",
      assignment: {
        subject: subject.name,
        faculty: faculty.firstName + " " + faculty.lastName,
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  getSubjectsbyCriteria,
  addSubject,
  assignSubject,
};
