const mongoose = require("mongoose");
const Attendance = require("../Models/Attendance.js");
const ClassInfo = require("../Models/Class.js");
const AssignedSubject = require("../Models/AssignedSubjects.js");
const Subject = require("../Models/Subject.js");

/**
 * function for getting the attendance of a student in  a specific subject
 * her we first checks that the subjectId and studentID is a valid mongoose objectId
 * then it fetches total Class held for that subject and total Class attended by student
 */
const getAttendancebySubject = async (req, res) => {
  const { studentId, subjectId } = req.query;
  if (
    !studentId ||
    !subjectId ||
    !mongoose.Types.ObjectId.isValid(studentId) ||
    !mongoose.Types.ObjectId.isValid(subjectId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid data-  studentId or subjectId ",
    });
  }
  try {
    const attendance = await Attendance.find({ subject: subjectId }).select(
      "-__v"
    );

    if (!attendance || attendance.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No Attendance Record found for the Subject",
      });
    }
    let totalClasses = attendance.length;
    let totalAttended = 0;
    attendance.forEach((query) => {
      if (query.students.length != 0) {
        query.students.forEach((student) => {
          if (student.studentId == studentId) {
            if (student.status.toLowerCase() == "present") {
              totalAttended++;
            }
          }
        });
      }
    });

    return res.status(200).json({
      success: true,
      message: "Attendance fetched successfully",
      totalClasses,
      totalAttended,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error Occurred",
    });
  }
};
/**
 * Function for marking Attendance 
 * verify if faculty is assigned to the subject that he is trying to mark attendance for
 * verify class exists and verify subject exists
 * then mark attendance for each students in studentsAttendance
 * ---------Validation MiddleWare is not implemented yet---------
 */
const markAttendance = async (req, res) => {
  const facultyId = req.user.id;
  const { department, year, section, subjectId, studentsAttendance } = req.body;
  try {
    const subjectInfo = await Subject.findById(subjectId).lean();
    if (!subjectInfo) {
      return res.status(404).json({
        message: "Invalid Subject",
        success: false,
      });
    }
    const facultyAssignment = await AssignedSubject.findOne({
      faculty: facultyId,
      subject: subjectId,
      section,
    }).lean();
    if (!facultyAssignment) {
      return res.status(403).json({
        message: "You are not assigned to this subject or section of class.",
        success: false,
      });
    }
    const classDoc = await ClassInfo.findOne({ department, year, section })
      .select("batch")
      .lean();
    if (!classDoc) {
      return res.status(404).json({
        message: "Invalid Class",
        success: false,
      });
    }

    if (
      !studentsAttendance ||
      !studentsAttendance.date ||
      !Array.isArray(studentsAttendance.students) ||
      studentsAttendance.students.length === 0
    ) {
      return res.status(400).json({
        message: "Invalid attendance data",
        success: false,
      });
    }

    const existingAttendance = await Attendance.findOne({
      subject: subjectId,
      date: studentsAttendance.date,
    });
    if (existingAttendance) {
      return res.status(409).json({
        message: "Attendance already marked for this subject and date",
        success: false,
      });
    }

    const attendance = new Attendance({
      subject: subjectId,
      date: studentsAttendance.date,
      students: studentsAttendance.students.map((student) => ({
        studentId: student.studentId,
        status: student.status,
      })),
    });

    await attendance.save();
    return res.status(201).json({
      message: "Attendance Marked Successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Occurred while marking Attendance",
      success: false,
    });
  }
};

module.exports = {
  getAttendancebySubject,
  markAttendance,
};
