const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  assignedSubject: {//at frontend show subject only in dropdown
    type: mongoose.Schema.Types.ObjectId,
    ref: "AssignedSubject",
    required: true,
  },
});

const timeTableSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    slots: [timeSlotSchema],
  },
  { timestamps: true }
);

const TimeTable = mongoose.model("TimeTable", timeTableSchema);
module.exports = TimeTable;
