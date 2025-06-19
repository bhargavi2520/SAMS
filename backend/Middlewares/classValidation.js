const joi = require("joi");

/**
 * validates criteria to get class details
 * batch , department , section
 */
const getClassValidation = (req, res, next) => {
  const schema = joi.object({
    batch: joi.string().required(),
    department: joi.string().required(),
    section: joi.string().required(),
  });

  const { error } = schema.validate(req.query, { convert: true });
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

/** 
 * validate essential details to be added in a new class
 * department, class Teacher , year , batch , section
 */
const newClassValidation = (req, res, next) => {
  const schema = joi.object({
    department: joi.string().required(),
    classTeacherId: joi.string().required(),
    year: joi.number().required(),
    batch: joi.string().required(),
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

module.exports = {
  getClassValidation,
  newClassValidation,
};
