const { User } = require("../Models/User");
const AssignedSubject = require("../Models/AssignedSubjects");
const Subject = require("../Models/Subject");

const getStudentDatabyCriteria = async (req, res) => {
  const { department, year, semester, section } = req.query;
  try {
    const query = {};
    if (department) query.department = department;
    if (year) query.year = year;
    if (semester) query.semester = semester;
    if (section) query.section = section;

    const students = await User.find(query)
      .where("role")
      .equals("Student")
      .select("-password -__v");
    if (students.length === 0) {
      return res.status(404).json({
        message: "No students found matching the criteria",
        success: false,
      });
    }
    res.status(200).json({
      message: "Students fetched successfully",
      students,
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

const getFaculties = async (req, res) => {
  try {
    const faculties = await User.find({ role: "FACULTY" }).select(
      "-password -__v "
    );
    if (faculties.length === 0) {
      return res.status(404).json({
        message: "No faculty members found",
        success: false,
      });
    }
    const facultyNames = faculties.map((faculty) => ({
      Id: faculty._id,
      firstName: faculty.firstName,
      lastName: faculty.lastName,
      email: faculty.email,
    }));
    res.status(200).json({
      message: "Faculty members fetched successfully",
      facultyNames,
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
          const subject = await Subject.findById(assigned.subject);
          if (!subject) {
            console.warn(`Subject not found for ID: ${assigned.subject}`);
            return null;
          }
          const yearNum = subject.year;
          const semesterNum = subject.semester;

          const students = await User.find({
            role: "STUDENT",
            section: "Section-1",
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

//student dashboard - subject faculty info

const getSubjectFacultyInfo = async (req, res) => {
  const studentId = req.user.id;
  try {
    const student = await User.findById(studentId).select("-password -__v");
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        success: false,
      });
    }
    const { year, semester, department, section } = student;
    const subjects = await Subject.find({
      year: year,
      department: department,
      semester: semester,
    });
    if (!subjects || subjects.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No Subjects found",
      });
    }
    const subjectFacultyinfo = await Promise.all(
      subjects.map(async (subject) => {
        const faculty = await AssignedSubject.findOne({
          subject: subject._id,
          section: 1,
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
                    faculty.faculty.firstName + " " + faculty.faculty.lastName,
                  email: faculty.faculty.email,
                }
              : null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: subjectFacultyinfo,
      message: "subject Faculty Info fetched successfully",
    });
  } catch (err) {
    console.error("Error in getSubjectFacultyInfo:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  getStudentDatabyCriteria,
  getFaculties,
  getFacultyDashboard,
  getSubjectFacultyInfo,
};
