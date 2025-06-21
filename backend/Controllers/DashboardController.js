const AssignedSubject = require("../Models/AssignedSubjects");
const classInfo = require("../Models/Class");
const TimeTable = require("../Models/TimeTable");
const { User } = require("../Models/User");
/**
 * student dashboard function 
 * currently returns time table and the subject, faculty info 
 * ------------------NOT TESTED YET------------------------
 */
const getStudentDashboard = async (req, res) => {
  const studentId = req.id;
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
    const { department, year, section, semester } = student;
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
    let subjectsFacultyInfo = [];
    if (classDoc.subjects.length > 0) {
      const facultyInfo = await Promise.all(
        classDoc.subjects.map(async (subject) => {
          const faculty = await AssignedSubject.findOne({
            subject: subject._id,
            section: section,
          }).populate("faculty");
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
          };
        })
      );
      subjectsFacultyInfo = facultyInfo;
    }
    const schedule = await TimeTable.findOne({ class: classDoc._id });

    return res.status(200).json({
      message: "Student Dashboard Info are ..",
      success: true,
      data: {
        timeTable: schedule || [],
        subjectsFacultyInfo,
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
