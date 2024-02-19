const mongoose = require("mongoose");

const refMaterialSchema = new mongoose.Schema({});

const Refmaterial = mongoose.model("Refmaterial", refMaterialSchema);

module.exports = Refmaterial;
