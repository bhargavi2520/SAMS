const { User } = require("../Models/User");
const classInfo = require("../Models/Class");
const AssignedSubject = require("../Models/AssignedSubjects");
const Subject = require("../Models/Subject");
const TimeTable = require("../Models/TimeTable");

/**
 * function to get students by the department ,year, semester and section
 * it finds the student for the given criteria
 * returns all details of students email , phone , parent Phone etc.
 */
const getStudentDataByCriteria = async (req, res) => {
  const { department, year, semester, section } = req.query;
  try {
    const query = {};
    if (department) query.department = department;
    if (year) query.year = year;
    if (semester) query.semester = semester;
    if (section) query.section = section;

    const students = await User.find(query)
      .where("role")
      .equals("STUDENT")
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

/**
 * function for admin dashboard
 * can get all faculties registered
 * return faculty mongoose Id , name , email
 */
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
          const subject = await Subject.findById(assigned.subject);
          if (!subject) {
            console.warn(`Subject not found for ID: ${assigned.subject}`);
            return null;
          }
          const yearNum = subject.year;
          const semesterNum = subject.semester;

          const students = await User.find({
            role: "STUDENT",
            section: subject.section,
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

/**
 * function for student dashboard
 * returns all subjects of student's current semester 
   along their assigned Faculty name and email
 */

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
    const subjectFacultyInfo = await Promise.all(
      subjects.map(async (subject) => {
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
                    faculty.faculty.firstName + " " + faculty.faculty.lastName,
                  email: faculty.faculty.email,
                }
              : null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: subjectFacultyInfo,
      message: "subject Faculty Info fetched successfully",
    });
  } catch (err) {
    console.error("Error in geTSubjectFacultyInfo:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

/**
 * function for student dashboard
 * returns the schedule/timetable for the current semester- created by higher authorities
 */

const getStudentSchedule = async (req, res) => {
  const studentId = req.user.id;
  try {
    const student = await User.findById(studentId).select(
      "-_id -password -_v "
    );
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student Not Found",
      });
    }
    const classDocument = await classInfo
      .findOne({
        department: student.department,
        section: student.section,
        year: student.year,
      })
      .select("_id");

    if (!classDocument) {
      return res.status(404).json({
        success: false,
        message:
          "Your Class is not registered yet, please contact your department",
      });
    }

    const timeTable = await TimeTable.findOne({ class: classDocument._id });
    if (!timeTable) {
      return res.status(404).json({
        success: false,
        message: "No schedule found for your class",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Schedule found",
      data: timeTable,
    });
  } catch (err) {
    console.error("Error in getStudentSchedule:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server occurred",
    });
  }
};

/**
 * logic for the creating timetable
 * where we checks if timetable is already not created for the same class 
 * also checks that faculty is not busy with another class for the same day - time.
 * creates new timetable for the given class without overlapping of lectures.
 */

const dayMap = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const createTimeTable = async (req, res) => {
  const { timeTable, classDetails } = req.body;

  try {
    const classId = await classInfo
      .findOne({
        department: classDetails.department,
        year: classDetails.year,
        section: classDetails.section,
      })
      .select("_id")
      .lean(); 

    if (!classId) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const existing = await TimeTable.findOne({ class: classId._id }).lean();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Timetable already exists for this class",
      });
    }

    const allTimeSlots = [];
    const facultyTimeMap = new Map(); 

    for (let dayIndex = 0; dayIndex < timeTable.length; dayIndex++) {
      const day = dayMap[dayIndex];
      const slots = timeTable[dayIndex];

      for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
          const slotA = slots[i];
          const slotB = slots[j];

          if (
            slotA.startTime < slotB.endTime &&
            slotA.endTime > slotB.startTime
          ) {
            return res.status(400).json({
              success: false,
              message: `Overlapping lectures detected on ${day}: (${slotA.startTime} - ${slotA.endTime}) and (${slotB.startTime} - ${slotB.endTime})`,
            });
          }
        }
      }

      for (const slot of slots) {
        const slotWithDay = { ...slot, day };
        allTimeSlots.push(slotWithDay);

        const facultyKey = `${slot.faculty}_${day}`;
        if (!facultyTimeMap.has(facultyKey)) {
          facultyTimeMap.set(facultyKey, []);
        }
        facultyTimeMap.get(facultyKey).push({
          startTime: slot.startTime,
          endTime: slot.endTime,
          day,
        });
      }
    }

    const facultyIds = [...new Set(allTimeSlots.map((slot) => slot.faculty))];
    const days = [...new Set(allTimeSlots.map((slot) => slot.day))];

    const existingSchedules = await TimeTable.find({
      class: { $ne: classId._id },
      "timeSlots.faculty": { $in: facultyIds },
      "timeSlots.day": { $in: days },
    })
      .select("timeSlots")
      .lean();

    for (const schedule of existingSchedules) {
      for (const existingSlot of schedule.timeSlots) {
        const facultyKey = `${existingSlot.faculty}_${existingSlot.day}`;
        const newSlots = facultyTimeMap.get(facultyKey);

        if (newSlots) {
          for (const newSlot of newSlots) {
            if (
              existingSlot.startTime < newSlot.endTime &&
              existingSlot.endTime > newSlot.startTime
            ) {
              return res.status(400).json({
                success: false,
                message: `Faculty is already assigned to another class on ${existingSlot.day} at overlapping time (${newSlot.startTime} - ${newSlot.endTime})`,
              });
            }
          }
        }
      }
    }

    const newTimeTable = new TimeTable({
      class: classId._id,
      timeSlots: allTimeSlots,
    });

    await newTimeTable.save();

    return res.status(201).json({
      success: true,
      message: "Time Table Created",
    });
  } catch (err) {
    console.error("Error creating timetable:", err);
    return res.status(500).json({
      success: false,
      message: "Error while creating new TimeTable",
    });
  }
};

module.exports = {
  getStudentDataByCriteria,
  getFaculties,
  getFacultyDashboard,
  getSubjectFacultyInfo,
  getStudentSchedule,
  createTimeTable,
};
