const mongoose = require("mongoose");
const questionPapersSchema = new mongoose.Schema({
  year: {
    type: Number,
  },
});
const subjectsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  questionPapers: [questionPapersSchema],
});
const semesterSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  subjects: [subjectsSchema],
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
