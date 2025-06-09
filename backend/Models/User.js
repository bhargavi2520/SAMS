const mongoose = require('mongoose');
const options = { discriminatorKey: 'role', collection: 'users' };


const baseUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Student', 'Admin', 'Faculty', 'HOD', 'ClassCordinator']
    }
}, options);

const User = mongoose.model('User', baseUserSchema);

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    aparId: {
        type: String,
        required: true
    },
    admissionDate: {
        type: Date,
        required: true
    },
    currentYear: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    transport: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    parentPhone: {
        type: String,
        required: true
    },
});

const Student = User.discriminator('Student', studentSchema);


const adminSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true,
    },
});

const Admin = User.discriminator('Admin', adminSchema);


const facultySchema = new mongoose.Schema({
    designation: {
        type: String,
        required: true
    },
});

const Faculty = User.discriminator('Faculty', facultySchema);


const hodSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true,
    }
});

const HOD = User.discriminator('HOD', hodSchema);


const classCoordinatorSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true,
        unique: true
    }
});
const ClassCoordinator = User.discriminator('ClassCordinator', classCoordinatorSchema);


module.exports = {
    User,
    Student,
    Admin,
    Faculty,
    HOD,
    ClassCoordinator,
};
