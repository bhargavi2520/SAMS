const joi = require("joi");

// common details every role have
const baseSchema = {
  email: joi.string().email().required(),
  password: joi.string().required(),
  role: joi
    .string()
    .valid("STUDENT", "ADMIN", "FACULTY", "HOD", "GUEST")
    .required(),
};

// student data
const studentProfileSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  phoneNumber: joi
    .string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  aparId: joi.string().required(),
  admission_academic_year: joi.date().max("now").required(),
  year: joi.number().required(),
  dateOfBirth: joi.date().required(),
  semester: joi.number().required(),
  department: joi.string().required(),
  section: joi.string().required(),
  transport: joi.string().required(),
  busRoute: joi.when("transport", {
    is: "College Bus",
    then: joi.string().required(),
    otherwise: joi.string().optional(),
  }),
  address: joi.string().required(),
  parentPhoneNumber: joi
    .string()
    .pattern(/^[0-9]{10}$/)
    .required(),
});

// common schema for same details
const simpleProfileSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  phoneNumber: joi
    .string()
    .pattern(/^[0-9]{10}$/)
    .required(),
});

// guest details
const guestProfileSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
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
        message: "Invalid data",
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
    email: joi.string().email().lowercase().required(),
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
