const passport = require("passport");
const PasswordResetToken = require("./models/resetpass.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //redirectUrl to save
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first !");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.isAuthenticated = true; // Set a variable indicating the user is authenticated
  } else {
    res.locals.isAuthenticated = false;
  }
  next();
};

module.exports.isValidResetLink = async (req, res, next) => {
  let checkFunc = async () => {
    try {
      const { token } = req.params;
      const now = new Date();

      // Find the reset token from the database
      const resetToken = await PasswordResetToken.findOne({ token: token });

      if (resetToken) {
        // Check if the token is expired
        if (resetToken.expiryTime > now) {
          // Token is valid, proceed to the next middleware
          return next();
        } else {
          return res
            .status(400)
            .send("Password reset link has expired. Please request a new one.");
        }
      } else {
        return res.status(400).send("Invalid token!");
      }
    } catch (error) {
      console.error("Error validating reset link:", error);
      return res.status(500).send("Internal Server Error");
    }
  };
  if (req.isAuthenticated || req.query.notlogged == "true") {
    checkFunc();
  } else {
    console.log(req.isAuthenticated);
    return res.status(401).send("Please log in first!");
  }
};
