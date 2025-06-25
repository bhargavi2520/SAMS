const { User } = require("../Models/User.js");

/**
 * Not completed yet
 * will be after department Assignments module.
 */
const checkAccess = async (req, res) => {
  const hodId = req.user.id;

  try {
    const hod = await User.findById(hodId).select("-password -__v").lean();
    if (!hod) {
      return res.status(404).json({
        message: "Account doesn't exist.",
        success: false,
      });
    }
    const subject = await Subject.findOne({ _id: subjectId });
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
        success: false,
      });
    }

    if(!(subject.department == hod.department)){
        
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Occurred while validating subject access.",
      success: false,
    });
  }
};

module.exports = checkAccess;
