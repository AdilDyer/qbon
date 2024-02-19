const mongoose = require("mongoose");
const Semester = require("./semester");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  semesters: [
    {
      type: mongoose.Types.ObjectId,
      ref: Semester,
    },
  ],
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
