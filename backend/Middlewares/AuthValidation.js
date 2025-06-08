const joi = require('joi');

const baseSchema = {
    name: joi.string().required(),
    email: joi.string().email().lowercase().required(),
    password: joi.string().required(),
    phoneNumber: joi.string().pattern(/^[0-9]{10}$/).required(),
    role: joi.string().valid('Student', 'Admin', 'Faculty', 'HOD', 'ClassCoordinator').required()
};


const studentSchema = joi.object({
    ...baseSchema,
    Id: joi.string().required(),
    aparId: joi.string().required(),
    admissionDate: joi.date().max('now').required(),
    currentYear: joi.number().required(),
    semester: joi.number().required(),
    department: joi.string().required(),
    transport: joi.string().required(),
    parentPhone: joi.string().pattern(/^[0-9]{10}$/).required(),
    address: joi.string().required()
}).unknown(true);

const facultySchema = joi.object({
    ...baseSchema,
    designation: joi.string().required(),
});

const hodSchema = joi.object({
    ...baseSchema,
    department: joi.string().required()
});

const classCoordinatorSchema = joi.object({
    ...baseSchema,
    department: joi.string().required()
});

const adminSchema = joi.object({
    ...baseSchema,
    department: joi.string().required()
});

const registerValidation = (req, res, next) => {
    try {
        const { role } = req.body;
        let schema;
        if (role == 'Student') {
            schema = studentSchema;
        } else if (role == 'Faculty') {
            schema = facultySchema;
        } else if (role == 'HOD') {
            schema = hodSchema;
        } else if (role == 'ClassCoordinator') {
            schema = classCoordinatorSchema;
        } else if (role == 'Admin') {
            schema = adminSchema;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Role is not Valid'
            });
        }

        const { error } = schema.validate(req.body)

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data',
                error: error.details[0].message
            });
        }
        next();

    } catch (err) {
        console.error('Validation error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during validation',
        });
    }
};


const loginValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().lowercase().required(),
        password: joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid data',
            error: error.details[0].message
        });
    }
    next();
}



module.exports = {
    registerValidation,
    loginValidation
};
