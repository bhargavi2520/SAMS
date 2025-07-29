const mongoose = require("mongoose");

const profilePhotoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const ProfilePhoto = mongoose.model("profilePhoto", profilePhotoSchema);
module.exports = ProfilePhoto;
