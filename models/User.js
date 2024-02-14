const mongoose = require("mongoose");
const School = require("./school");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  //username and pass are defalt added by passport
});

userSchema.plugin(passportLocalMongoose); //above the below line
const User = mongoose.model("User", userSchema);

module.exports = User;
