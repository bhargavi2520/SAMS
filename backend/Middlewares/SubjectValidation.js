const joi = require("joi");

/**
 * validate subject details 
 * subject name , subject code
 * department , year , semester
 */
const addSubjectValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().required(),
    code: joi.string().required(),
    department: joi.string().required(),
    year: joi.number().required(),
    semester: joi.number().required(),
    batch : joi.string().required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

/**
 * checks if we are getting efficient data to assign a subject
 * faculty , subject , and section to be assigned
 */
const assignSubjectValidation = (req, res, next) => {
  const schema = joi.object({
    subjectId: joi.string().required(),
    facultyId: joi.string().required(),
    section: joi.number().required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

/**
 * check if req have following data
 * department , year, section
 */
const getSubjectsValidation = (req, res, next) => {
  const schema = joi.object({
    department: joi.string().required(),
    year: joi.number().required(),
    semester: joi.number().required(),
  });
  const { error } = schema.validate(req.query, { convert: true });

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

module.exports = {
  addSubjectValidation,
  assignSubjectValidation,
  getSubjectsValidation,
};
