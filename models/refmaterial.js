const mongoose = require("mongoose");
const User = require("./user.js");
const Subject = require("./subject.js");

const refMaterialSchema = new mongoose.Schema({
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

const Refmaterial = mongoose.model("Refmaterial", refMaterialSchema);

module.exports = Refmaterial;
