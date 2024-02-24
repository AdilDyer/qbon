const mongoose = require("mongoose");
const Semester = require("./semester.js");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  semesters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Semester,
    },
  ],
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
