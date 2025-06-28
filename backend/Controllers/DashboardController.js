const AssignedSubject = require("../Models/AssignedSubjects");
const Attendance = require("../Models/Attendance");
const classInfo = require("../Models/Class");
const TimeTable = require("../Models/TimeTable");
const { User } = require("../Models/User");
const Subject = require("../Models/Subject.js");
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
      .populate({ path: "subjects.subject", select: "name code" })
      .select("-students");
    if (!classDoc) {
      return res.status(404).json({
        message:
          "You are not registered to any Class, Contact your administrator",
        success: false,
      });
    }
    // extracting subjects and their teachers
    let attendanceAndFacultyInfo = [];
    if (classDoc.subjects.length > 0) {
      const subjectsInfo = await Promise.all(
        classDoc.subjects.map(async (individual) => {
          const faculty = await AssignedSubject.findOne({
            subject: individual.subject._id,
            section: section,
          })
            .populate("faculty")
            .lean();
          //attendance
          const attendanceRecords = await Attendance.find({
            subject: individual.subject._id,
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
              subjectName: individual.subject.name,
              subjectCode: individual.subject.code,
            },
            faculty:
              faculty && faculty.faculty
                ? {
                    facultyName:
                      faculty.faculty.firstName.charAt(0).toUpperCase() +
                      faculty.faculty.firstName.slice(1).toLowerCase() +
                      " " +
                      (faculty.faculty.lastName.charAt(0).toUpperCase() +
                        faculty.faculty.lastName.slice(1).toLowerCase()),
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
        timeTable: schedule && schedule.timeSlots ? schedule.timeSlots : [],
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
/**
 * faculty Dashboard function
 * will get all data that is needed on faculty dashboard
 * ---------------- Not completed Yet ------------------
 * currently returning assigned subjects and corresponding students for the subject.
 */

const getFacultyDashboard = async (req, res) => {
  const facultyId = req.user.id;

  try {
    const assignedSubjects = await AssignedSubject.find({ faculty: facultyId });

    if (!assignedSubjects || assignedSubjects.length === 0) {
      return res.status(404).json({
        message: "No subjects assigned to you",
        success: false,
      });
    }
    const studentsAndSubjects = await Promise.all(
      assignedSubjects.map(async (assigned) => {
        try {
          const subject = await Subject.findById(assigned.subject).lean();
          if (!subject) {
            console.warn(`Subject not found for ID: ${assigned.subject}`);
            return null;
          }
          const yearNum = subject.year;
          const semesterNum = subject.semester;

          const students = await User.find({
            role: "STUDENT",
            section: assigned.section,
            department: subject.department,
            year: yearNum,
            semester: semesterNum,
          }).select("-password -__v");
          return {
            subject: {
              id: subject._id,
              name: subject.name,
              department: subject.department,
              year: subject.year,
              semester: subject.semester,
            },
            section: assigned.section,
            students: students.map((student) => {
              return {
                Id: student._id,
                name: student.firstName + " " + student.lastName,
              };
            }),
            studentCount: students.length,
          };
        } catch (error) {
          console.error(
            `Error processing assigned subject ${assigned._id}:`,
            error
          );
          return null;
        }
      })
    );
    const validResults = studentsAndSubjects.filter((item) => item !== null);

    if (validResults.length === 0) {
      return res.status(404).json({
        message: "No valid subjects found or all subjects failed to load",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Subjects and students fetched successfully",
      success: true,
      data: validResults,
      totalSubjects: validResults.length,
    });
  } catch (err) {
    console.error("Error in getFacultyDashboard:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
module.exports = {
  getStudentDashboard,
  getFacultyDashboard,
};
