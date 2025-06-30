const { User } = require("../Models/User");
const classInfo = require("../Models/Class");
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

    const existing = await TimeTable.findOne({ class: classId._id });
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

    if (existing) {
      existing.timeSlots = allTimeSlots;
      await existing.save();
      return res.status(200).json({
        success: true,
        message: "Timetable updated successfully",
      });
    } else {
      const newTimeTable = new TimeTable({
        class: classId._id,
        timeSlots: allTimeSlots,
      });
      await newTimeTable.save();
      return res.status(201).json({
        success: true,
        message: "Time Table Created",
      });
    }
  } catch (err) {
    console.error("Error creating/updating timetable:", err);
    return res.status(500).json({
      success: false,
      message: "Error while creating/updating TimeTable",
    });
  }
};

/**
 * Check if a timetable exists for a class
 * GET /userData/checkTimetable?department=...&year=...&section=...
 */
const checkTimetableExists = async (req, res) => {
  const { department, year, section } = req.query;
  try {
    const classDoc = await classInfo.findOne({ department, year, section }).select('_id');
    if (!classDoc) {
      return res.status(404).json({ exists: false, message: 'Class not found' });
    }
    const timetable = await TimeTable.findOne({ class: classDoc._id });
    if (timetable) {
      return res.status(200).json({ exists: true, timetable });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error('Error checking timetable existence:', err);
    return res.status(500).json({ exists: false, message: 'Internal server error' });
  }
};

module.exports = {
  getStudentDataByCriteria,
  getFaculties,
  createTimeTable,
  checkTimetableExists,
};
