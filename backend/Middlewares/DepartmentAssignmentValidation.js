const joi = require("joi");

/**
 * Middleware to validate department assignment request body.
 * Expects: { hodId: string (ObjectId), department: string, year: number }
 */
const departmentAssignmentValidation = (req, res, next) => {
  const schema = joi.object({
    hodId: joi.string().length(24).hex().required(),
    department: joi.string().required(),
    years: joi.number().required(),
    batch : joi.string().required(),
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
  departmentAssignmentValidation,
};