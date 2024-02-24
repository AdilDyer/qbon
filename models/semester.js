const mongoose = require("mongoose");
const Subject = require("./subject.js");

const semesterSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Subject,
    },
  ],
});

const Semester = mongoose.model("Semester", semesterSchema);

module.exports = Semester;
