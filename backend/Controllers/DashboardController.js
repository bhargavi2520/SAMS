const AssignedSubject = require("../Models/AssignedSubjects");
const Attendance = require("../Models/Attendance");
const classInfo = require("../Models/Class");
const TimeTable = require("../Models/TimeTable");
const { User } = require("../Models/User");
/**
 * student dashboard function
 * currently returns time table and the subject, faculty info and student attendance for each subject
 */
const getStudentDashboard = async (req, res) => {
  const studentId = req.user.id;
  try {
    const student = await User.findById(studentId)
      .select("-__v -password")
      .lean();
    if (!student) {
      return res.status(404).json({
        message: "Student Not found",
        success: false,
      });
    }
    //finding class
    const { department, year, section } = student;
    const classDoc = await classInfo
      .findOne({ department, year, section })
      .populate({ path: "subjects.subject", select: "name code" });
    if (!classDoc) {
      return res.status(404).json({
        message: "No registered class found, Contact your administrator",
        success: false,
      });
    }
    // extracting subjects and their teachers
    let attendanceAndFacultyInfo = [];
    if (classDoc.subjects.length > 0) {
      const subjectsInfo = await Promise.all(
        classDoc.subjects.map(async (subject) => {
          const faculty = await AssignedSubject.findOne({
            subject: subject._id,
            section: section,
          })
            .populate("faculty")
            .lean();
          //attendance
          const attendanceRecords = await Attendance.find({
            subject: subject._id,
          })
            .select("-__v")
            .lean();
          let totalClasses = attendanceRecords.length;
          let totalAttended = 0;
          if (totalClasses > 0) {
            attendanceRecords.forEach((record) => {
              if (record.students && record.students.length > 0) {
                record.students.forEach((studentAtt) => {
                  if (
                    studentAtt.studentId.toString() === studentId.toString() &&
                    studentAtt.status &&
                    studentAtt.status.toLowerCase() === "present"
                  ) {
                    totalAttended++;
                  }
                });
              }
            });
          }

          return {
            subject: {
              subjectName: subject.name,
              subjectCode: subject.code,
            },
            faculty:
              faculty && faculty.faculty
                ? {
                    facultyName:
                      faculty.faculty.firstName +
                      " " +
                      faculty.faculty.lastName,
                    email: faculty.faculty.email,
                  }
                : null,
            attendance: {
              totalClasses,
              totalAttended,
            },
          };
        })
      );
      attendanceAndFacultyInfo = subjectsInfo;
    }
    const schedule = await TimeTable.findOne({ class: classDoc._id })
      .select("-_id -class -timeSlots._id")
      .lean();

    return res.status(200).json({
      message: "Student Dashboard Info are ..",
      success: true,
      data: {
        timeTable: schedule.timeSlots || [],
        attendanceAndFacultyInfo,
      },
    });
  } catch (err) {
    console.log("StudentDashboard Error", err);
    return res.status(500).json({
      message: "Internal Server at Student Dashboard",
    });
  }
};

module.exports = {
  getStudentDashboard,
};
