const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
});

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  semesters: [semesterSchema],
});

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  courses: [courseSchema],
});

const School = mongoose.model("School", schoolSchema);

module.exports = School;
