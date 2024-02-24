const mongoose = require("mongoose");
const User = require("./user.js");
const Subject = require("./subject.js");

const questionPapersSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Subject,
    required: true,
  },
});

const Quespaper = mongoose.model("Quespaper", questionPapersSchema);

module.exports = Quespaper;
