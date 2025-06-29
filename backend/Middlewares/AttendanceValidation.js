const joi = require("joi");

/**
 * Middleware to validate query params for getting attendance by subject.
 * Expects:
 * - studentId: string (required, ObjectId)
 * - subjectId: string (required, ObjectId)
 */
const getAttendanceBySubjectValidation = (req, res, next) => {
  const schema = joi.object({
    studentId: joi.string().length(24).hex().required(),
    subjectId: joi.string().length(24).hex().required(),
  });

  const { error } = schema.validate(req.query, { convert: true });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

/**
 * Middleware to validate body for marking attendance.
 * Expects:
 * - department: string (required)
 * - year: number (required)
 * - section: number (required)
 * - subjectId: string (required, ObjectId)
 * - studentsAttendance: { date: string, students: [{ studentId, status }] }
 */
const markAttendanceValidation = (req, res, next) => {
  const studentSchema = joi.object({
    studentId: joi.string().length(24).hex().required(),
    status: joi.string().valid("Present", "Absent").required(),
  });

  const studentsAttendanceSchema = joi.object({
    date: joi.string().required(),
    students: joi.array().items(studentSchema).min(1).required(),
  });

  const schema = joi.object({
    department: joi.string().required(),
    year: joi.number().required(),
    section: joi.number().required(),
    subjectId: joi.string().length(24).hex().required(),
    studentsAttendance: studentsAttendanceSchema.required(),
  });

  const { error } = schema.validate(req.body, { convert: true });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = {
  markAttendanceValidation,
  getAttendanceBySubjectValidation,
};
