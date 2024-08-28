import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.models.School || mongoose.model("School", SchoolSchema);
