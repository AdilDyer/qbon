const mongoose = require("mongoose");
const Course = require("./course.js");



const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Course,
    },
  ],
});

const School = mongoose.model("School", schoolSchema);

module.exports = School;
