const mongoose = require("mongoose");
const School = require("./school.js");
const Course = require("./course.js");
const Semester = require("./semester.js");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: School,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Course,
    required: true,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Semester,
    required: true,
  },
  //username and pass are defalt added by passport
});

userSchema.plugin(passportLocalMongoose); //above the below line
const User = mongoose.model("User", userSchema);

module.exports = User;
