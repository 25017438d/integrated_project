import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  type: { type: String, enum: ["lost", "found"], required: true },
  date: { type: Date, default: Date.now },
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
});

export default mongoose.model("Notice", noticeSchema);