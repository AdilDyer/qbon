const mongoose = require("mongoose");

const questionPapersSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  link: {
    type:String,
    required:true, 
  }
});

const Quespaper = mongoose.model("Quespaper", questionPapersSchema);

module.exports = Quespaper;
