const joi = require("joi");

const addSubjectValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().required(),
    code: joi.string().required(),
    department: joi.string().required(),
    year: joi.number().required(),
    semester: joi.number().required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

const assignSubjectValidation = (req, res, next) => {
  const schema = joi.object({
    subjectId: joi.string().required(),
    facultyId: joi.string().required(),
    section: joi.string().required(),
  });
  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

const getSubjectsValidation = (req, res, next) => {
  const schema = joi.object({
    department: joi.string().required(),
    year: joi.number().required(),
    section: joi.number().required(),
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
