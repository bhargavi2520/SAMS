const joi = require("joi");

/**
 * Middleware to validate the request body for creating a timetable.
 * Expects:
 * - classDetails: { department, year, section }
 * - timeTable: Array of arrays (days x slots), each slot with faculty, startTime, endTime, subject, etc.
 */
const createTimeTableValidation = (req, res, next) => {
  const slotSchema = joi.object({
    faculty: joi.string().required(),
    subject: joi.string().required(),
    startTime: joi.string().required(), 
    endTime: joi.string().required(), 
  });

  const schema = joi.object({
    classDetails: joi.object({
      department: joi.string().required(),
      year: joi.number().required(),
      section: joi.number().required(),
    }).required(),
    timeTable: joi.array()
      .items(
        joi.array().items(slotSchema)
      )
      .required(),
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
  createTimeTableValidation,
};