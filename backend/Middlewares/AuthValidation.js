const joi = require("joi");

// common details every role have
const baseSchema = {
  email: joi.string().email().lowercase().required().trim(),
  password: joi.string().required(),
  role: joi
    .string()
    .valid("STUDENT", "ADMIN", "FACULTY", "HOD", "GUEST")
    .required(),
};

// student data
const studentProfileSchema = joi
  .object({
    firstName: joi.string().required().trim(),
    lastName: joi.string().required(),
    phoneNumber: joi
      .string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    aparId: joi.string().required(),
    rollNumber: joi.string().required(),
    admission_academic_year: joi.date().max("now").required(),
    year: joi.number().required(),
    dateOfBirth: joi.date().required(),
    semester: joi.number().required(),
    department: joi.string().required(),
    section: joi.number().required(),
    transport: joi.string().required(),
    busRoute: joi.when("transport", {
      is: "College Bus",
      then: joi.string().required().trim(),
      otherwise: joi.string().optional(),
    }),
    address: joi.string().required().trim(),
    parentPhoneNumber: joi
      .string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    lateralEntry: joi.boolean().optional(),
  })
  .custom((value, helpers) => {
    if (value.year == 1 && ![1, 2].includes(value.semester)) {
      return helpers.error("any.invalid", {
        message: "For year 1, semester must be 1 or 2",
      });
    } else if (value.year == 2 && ![3, 4].includes(value.semester)) {
      return helpers.error("any.invalid", {
        message: "For year 1, semester must be 1 or 2",
      });
    } else if (value.year == 3 && ![5, 6].includes(value.semester)) {
      return helpers.error("any.invalid", {
        message: "For year 1, semester must be 1 or 2",
      });
    } else if (value.year == 4 && ![7, 8].includes(value.semester)) {
      return helpers.error("any.invalid", {
        message: "For year 1, semester must be 1 or 2",
      });
    }
    return value;
  });

// common schema for same details
const simpleProfileSchema = joi.object({
  firstName: joi.string().required().trim(),
  lastName: joi.string().required().trim(),
  phoneNumber: joi
    .string()
    .pattern(/^[0-9]{10}$/)
    .required(),
});

// guest details
const guestProfileSchema = joi.object({
  firstName: joi.string().required().trim(),
  lastName: joi.string().required().trim(),
});

// all roles in a single object
const schemasByRole = {
  STUDENT: joi
    .object({
      ...baseSchema,
      profileData: studentProfileSchema,
    })
    .unknown(true),
  FACULTY: joi.object({
    ...baseSchema,
    profileData: simpleProfileSchema,
  }),
  HOD: joi
    .object({
      ...baseSchema,
      profileData: guestProfileSchema,
    })
    .unknown(true),
  ADMIN: joi
    .object({
      ...baseSchema,
      profileData: guestProfileSchema,
    })
    .unknown(true),
  GUEST: joi
    .object({
      ...baseSchema,
      profileData: guestProfileSchema,
    })
    .unknown(true),
};

/**
 * runs before the actual registration
 * checks all details are available as per schemas
 */
const registerValidation = (req, res, next) => {
  try {
    const { role } = req.body;
    const schema = schemasByRole[role];
    if (!schema) {
      return res.status(400).json({
        success: false,
        message: "Role is not valid or schema not found for role",
      });
    }

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        error: error.details[0].message,
      });
    }
    next();
  } catch (err) {
    console.error("Validation error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * runs before the login function
 * checks login details are available as per login schema
 */
const loginValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().lowercase().required().trim(),
    password: joi.string().required(),
    rememberMe: joi.boolean(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid data",
      error: error.details[0].message,
    });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
};
