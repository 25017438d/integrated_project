import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["lost", "found"], required: true },
    date: { type: Date, required: true },
    venue: String,
    contact: String,
    description: String,
    image: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    responses: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Notice", noticeSchema);
