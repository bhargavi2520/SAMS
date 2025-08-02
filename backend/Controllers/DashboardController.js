const AssignedSubject = require("../Models/AssignedSubjects");
const Attendance = require("../Models/Attendance");
const classInfo = require("../Models/Class");
const TimeTable = require("../Models/TimeTable");
const { User } = require("../Models/User");
const Subject = require("../Models/Subject.js");
const departmentAssignment = require("../Models/AssignedDepartments.js");
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
    const { department, year, section, batch } = student;
    const classDoc = await classInfo
      .findOne({ department, year, section, batch })
      .populate({ path: "subjects.subject", select: "name code" })
      .select("-students");
    if (!classDoc) {
      return res.status(404).json({
        message:
          "You are not registered to any Class, Contact your administrator",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Student Dashboard fetched successfully",
      success: true,
    });
  } catch (err) {
    console.log("StudentDashboard Error", err);
    return res.status(500).json({
      message: "Internal Server at Student Dashboard",
    });
  }
};

/**
 * student academic details
 * returns student academic details like time table , subjects, faculty and attendance
 */

const getStudentAcademicDetails = async (req, res) => {
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
    const {department, year, section, batch} = student;
    const classDoc = await classInfo
      .findOne({ department, year, section, batch })
      .populate({ path: "subjects.subject", select: "name code" })
      .select("-students");

    if (!classDoc) {
      return res.status(404).json({
        message:
          "You are not registered to any Class, Contact your administrator",
        success: false,
      });
    }

    const schedule = await TimeTable.findOne({ class: classDoc._id })
      .select("-_id -class -timeSlots._id")
      .lean();

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

    return res.status(200).json({
      message: "Student Dashboard Info are ..",
      success: true,
      data: {
        timeTable: schedule && schedule.timeSlots ? schedule.timeSlots : [],
        attendanceAndFacultyInfo,
      },
    });
  } catch (err) {
    console.log("student academic details Error", err);
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
    const assignedSubjects = await AssignedSubject.find({
      faculty: facultyId,
    }).lean();
    if (!assignedSubjects || assignedSubjects.length === 0) {
      return res.status(404).json({
        message: "No subjects assigned to you",
        success: false,
      });
    }
    const subjectIds = assignedSubjects.map((a) => a.subject);
    const subjects = await Subject.find({ _id: { $in: subjectIds } })
      .select("_id name department year semester")
      .lean();
    const subjectMap = Object.fromEntries(
      subjects.map((s) => [s._id.toString(), s])
    );

    const combos = assignedSubjects.map((a) => {
      const subj = subjectMap[a.subject.toString()];
      return {
        section: a.section,
        department: subj.department,
        year: subj.year,
        semester: subj.semester,
        subjectId: subj._id.toString(),
      };
    });

    const studentQuery = {
      role: "STUDENT",
      $or: combos.map((c) => ({
        section: c.section,
        department: c.department,
        year: c.year,
        semester: c.semester,
      })),
    };
    const allStudents = await User.find(studentQuery)
      .select(
        "_id firstName lastName section department year semester rollNumber"
      )
      .lean();

    const studentsByCombo = {};
    combos.forEach((c) => {
      const key = `${c.subjectId}-${c.section}`;
      studentsByCombo[key] = allStudents.filter(
        (s) =>
          s.section === c.section &&
          s.department === c.department &&
          s.year === c.year &&
          s.semester === c.semester
      );
    });

    const results = assignedSubjects.map((a) => {
      const subj = subjectMap[a.subject.toString()];
      const key = `${subj._id.toString()}-${a.section}`;
      const students = (studentsByCombo[key] || []).map((student) => ({
        id: student._id,
        name: student.firstName + " " + student.lastName,
        rollNumber: student.rollNumber,
      }));
      return {
        subject: {
          id: subj._id,
          name: subj.name,
          department: subj.department,
          year: subj.year,
          semester: subj.semester,
        },
        section: a.section,
        students,
        studentCount: students.length,
      };
    });

    if (results.length === 0) {
      return res.status(404).json({
        message: "No valid subjects found or all subjects failed to load",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Subjects and students fetched successfully",
      success: true,
      data: results,
      totalSubjects: results.length,
    });
  } catch (err) {
    console.error("Error in getFacultyDashboard:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

/**
 * hod dashboard function
 * returns department and year assigned to hod
 * and return hod details.
 */

const getHodDashboard = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = User.findById(userId).select("-password -_id -__v").lean();
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const assigned = await departmentAssignment
      .findOne({ hod: userId })
      .sort({ createdAt: -1 })
      .lean();
    if (!assigned) {
      return res.status(204).json({
        message: "No department is assigned to You",
        success: true,
        department: "",
        years: [],
      });
    }
    const { departmentYears, department } = assigned;

    return res.status(200).json({
      message: "Dashboard fetched successfully",
      success: true,
      department,
      years: departmentYears,
    });
  } catch (err) {
    console.log("error in hod dashboard : ", err);
    return res.status(500).json({
      message: "Service unavailable right now",
      success: false,
    });
  }
};

/**
 * admin dashboard
 * returns admin info
 */

const getAdminDashboard = async (req, res) => {
  const userId = req.user.id;
  try {
    const admin = await User.findById(userId).select("-password").lean();
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Account doesn't exist",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Admin Dashboard Loaded.",
      adminInfo: admin,
    });
  } catch (err) {
    console.log("error at admin dashboard", err);
    return res.status(500).json({
      message: "Internal Server Occurred",
    });
  }
};

module.exports = {
  getStudentDashboard,
  getFacultyDashboard,
  getHodDashboard,
  getAdminDashboard,
  getStudentAcademicDetails,
};
