const mongoose = require("mongoose");

const departmentAssignmentSchema = new mongoose.Schema(
  {
    hod: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    batch : {
      type : String,
      required : true,
    },
    department: {
      type: String,
      required: true,
    },
    departmentYears: {
      type: [Number],
      required: true,
    },
  },
  { timeStamps: true }
);

const departmentAssignment = mongoose.model(
  "departmentAssigned",
  departmentAssignmentSchema
);
module.exports = departmentAssignment;
