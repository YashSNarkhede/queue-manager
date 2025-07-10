import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  queueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Queue",
  },
  number: Number,
  status: {
    type: String,
    enum: ["waiting", "assigned", "cancelled"],
    default: "waiting",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  assignedAt: Date,
});

export default mongoose.model("Token", tokenSchema);
