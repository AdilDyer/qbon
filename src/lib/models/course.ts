import mongoose from "mongoose";
import School from "./school";
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
});

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
