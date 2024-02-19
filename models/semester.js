const mongoose = require("mongoose");
const Subject = require("./subject");

const semesterSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  subjects: [
    {
      type: mongoose.Types.ObjectId,
      ref: Subject,
    },
  ],
});

const Semester = mongoose.model("Semester", semesterSchema);

module.exports = Semester;
