const mongoose = require("mongoose");

const departmentAssignmentSchema = new mongoose.Schema(
  {
    hod: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    departmentYears: {
      type: [Number],
      required: true,
    },
    createdAt:{
      type: Date,
      default: Date.now(),
    }
  },
  { timeStamps: true }
);

const departmentAssignment = mongoose.model(
  "departmentAssigned",
  departmentAssignmentSchema
);
module.exports = departmentAssignment;
