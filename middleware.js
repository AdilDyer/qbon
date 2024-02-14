module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //redirectUrl to save
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first !");
    return res.redirect("/login");
  }
  next();
};
