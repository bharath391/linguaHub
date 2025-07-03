import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // keep as "User" to match existing User model
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Model for managing friend requests between users
const FriendRequest = mongoose.model("FriendRequest", requestSchema);

export default FriendRequest;
