const { ref, required } = require("joi");
const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    department: {
      type: String,
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
      type: Number,
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

const classInfo = mongoose.model("Class", ClassSchema);
module.exports = classInfo;