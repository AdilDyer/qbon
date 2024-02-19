const mongoose = require("mongoose");
const School = require("./school");
const Course = require("./course");
const Semester = require("./semester");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Types.ObjectId,
    ref: School,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: Course,
    required: true,
  },
  semester: {
    type: mongoose.Types.ObjectId,
    ref: Semester,
    required: true,
  },
  //username and pass are defalt added by passport
});

userSchema.plugin(passportLocalMongoose); //above the below line
const User = mongoose.model("User", userSchema);

module.exports = User;
