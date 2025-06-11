const mongoose = require("mongoose");

const assignedSubject = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  section: {
    type: Number,
    required: true,
  },
});

const AssignedSubject = mongoose.model("AssignedSubject", assignedSubject);
module.exports = AssignedSubject;
