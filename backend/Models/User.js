const mongoose = require("mongoose");
const options = {
  discriminatorKey: "role",
  collection: "users",
  timestamps: true,
};

const baseUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
   role: {
    type: String,
    required: true,
    enum: ['STUDENT', 'FACULTY', 'HOD', 'CLASS_TEACHER', 'GUEST']
    }
}, options);

const User = mongoose.model("User", baseUserSchema);

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  rollNumber:{
    type : String,
    required : true,
  },
  aparId: {
    type: String,
    required: true,
  },
  admission_academic_year: {
    type: Date,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  section: {
    type: Number,
    required: true,
  },
  transport: {
    type: String,
    required: true,
  },
  busRoute: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  parentPhoneNumber: {
    type: String,
    required: true,
  },
});

const Student = User.discriminator("STUDENT", studentSchema);

const facultySchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

const Faculty = User.discriminator('FACULTY', facultySchema);

const classTeacherSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

const ClassTeacher = User.discriminator("CLASS_TEACHER", classTeacherSchema);

const hodSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const HOD = User.discriminator("HOD", hodSchema);

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const Admin = User.discriminator("ADMIN", adminSchema);

const guestSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const Guest = User.discriminator("GUEST", guestSchema);

module.exports = {
  User,
  Student,
  Admin,
  Faculty,
  HOD,
  Guest,
};
