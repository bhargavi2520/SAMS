const { ref, required } = require("joi");
const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    subjects: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
        },
      },
    ],
    students: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

const Class = mongoose.model("Class", ClassSchema);
module.exports = Class;
