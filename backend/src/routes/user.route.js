import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest as handleAcceptRequest,
  getFriendRequests as fetchIncomingRequests,
  getMyFriends as fetchMyFriends,
  getOutgoingFriendReqs as fetchOutgoingRequests,
  getRecommendedUsers as fetchSuggestedUsers,
  sendFriendRequest as handleSendRequest,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// Apply auth middleware to all routes below
userRouter.use(protectRoute);

// Get recommended users to connect with
userRouter.get("/", fetchSuggestedUsers);

// Get current user's friends
userRouter.get("/friends", fetchMyFriends);

// Send a new friend request
userRouter.post("/friend-request/:id", handleSendRequest);

// Accept a received friend request
userRouter.put("/friend-request/:id/accept", handleAcceptRequest);

// Get all incoming friend requests
userRouter.get("/friend-requests", fetchIncomingRequests);

// Get outgoing friend requests sent by current user
userRouter.get("/outgoing-friend-requests", fetchOutgoingRequests);

// Export the router
export default userRouter;
