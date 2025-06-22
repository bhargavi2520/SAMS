const mongoose = require("mongoose");
const Attendance = require("../Models/Attendance.js");

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
    const attendance = await Attendance.find({ subject: subjectId }).select("-__v");

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

module.exports = {
  getAttendancebySubject,
};
