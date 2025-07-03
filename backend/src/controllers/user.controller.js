import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

// Get recommended users to connect with
export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedAccounts = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // Exclude current user
        { _id: { $nin: currentUser.friends } }, // Exclude friends
        { isOnboarded: true },
      ],
    });

    res.status(200).json(recommendedAccounts);
  } catch (err) {
    console.error("Error in getRecommendedUsers controller:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get all friends of the current user
export async function getMyFriends(req, res) {
  try {
    const userRecord = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );

    res.status(200).json(userRecord.friends);
  } catch (err) {
    console.error("Error in getMyFriends controller:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Send a friend request to another user
export async function sendFriendRequest(req, res) {
  try {
    const senderId = req.user.id;
    const { id: recipientId } = req.params;

    if (senderId === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send a friend request to yourself" });
    }

    const recipientUser = await User.findById(recipientId);
    if (!recipientUser) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipientUser.friends.includes(senderId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    const duplicateRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    });

    if (duplicateRequest) {
      return res.status(400).json({
        message: "A friend request already exists between you and this user",
      });
    }

    const newRequest = await FriendRequest.create({
      sender: senderId,
      recipient: recipientId,
    });

    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Error in sendFriendRequest controller:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Accept a friend request
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add each user to the other's friends array
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.log("Error in acceptFriendRequest controller:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get incoming and accepted friend requests
export async function getFriendRequests(req, res) {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    const acceptedRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingRequests, acceptedRequests });
  } catch (err) {
    console.log("Error in getFriendRequests controller:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get outgoing friend requests sent by the current user
export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    res.status(200).json(outgoingRequests);
  } catch (err) {
    console.log("Error in getOutgoingFriendReqs controller:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
