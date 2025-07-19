const jwt = require("jsonwebtoken");

const tokenRefresher = (req, res, next) => {
  try {
    const refreshedToken = jwt.sign(
      {
        id: req.user.id,
        role: req.user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '12h',
      }
    );

    res.setHeader("refreshedToken",refreshedToken);
    res.setHeader("Access-Control-Expose-Headers", "refreshedToken");
    next();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error at refresher." });
  }
};


module.exports = tokenRefresher;