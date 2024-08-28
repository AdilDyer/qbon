import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  semesterNo: {
    type: Number,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

export default mongoose.models.Subject ||
  mongoose.model("Subject", SubjectSchema);
