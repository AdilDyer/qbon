import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    subject: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Subject",
      type: String,
      required: true,
    },
    uploadedBy: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "User",
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Material ||
  mongoose.model("Material", MaterialSchema);
