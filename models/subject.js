const mongoose = require("mongoose");
const Quespaper = require("./quespaper.js");
const Refmaterial = require("./refmaterial.js");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  questionPapers: [
    {
      type: mongoose.Types.ObjectId,
      ref: Quespaper,
    },
  ],
  referenceMaterials: [
    {
      type: mongoose.Types.ObjectId,
      ref: Refmaterial,
    },
  ],
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
