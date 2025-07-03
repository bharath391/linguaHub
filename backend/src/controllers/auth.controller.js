import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// User signup controller
export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Missing fields !" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 chars" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid Email !" });
    }

    const existingAccount = await User.findOne({ email });
    if (existingAccount) {
      return res.status(400).json({
        message: "Email already exists, please login instead or use another email to signup !",
      });
    }

    const avatarIdx = Math.floor(Math.random() * 100) + 1;
    const randomAvatarUrl = `https://avatar.iran.liara.run/public/${avatarIdx}.png`;

    const createdUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatarUrl,
    });

    // Sync user with Stream
    try {
      await upsertStreamUser({
        id: createdUser._id.toString(),
        name: createdUser.fullName,
        image: createdUser.profilePic || "",
      });
      console.log(`Stream user created for ${createdUser.fullName}`);
    } catch (streamErr) {
      console.log("Error creating Stream user:", streamErr);
    }

    const authToken = jwt.sign(
      { userId: createdUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", authToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: createdUser });
  } catch (err) {
    console.log("Error in signup controller:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// User login controller
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const passwordValid = await foundUser.checkPassword(password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const authToken = jwt.sign(
      { userId: foundUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "14d" }
    );

    res.cookie("jwt", authToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user: foundUser });
  } catch (err) {
    console.log("Error found login controller:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// User logout controller
export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout success !" });
}

// Onboarding controller
export async function onboard(req, res) {
  try {
    const currentUserId = req.user._id;
    const {
      fullName,
      bio,
      nativeLanguage,
      learningLanguage,
      location
    } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required for onboarding",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedAccount = await User.findByIdAndUpdate(
      currentUserId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ message: "User not found !" });
    }

    // Update Stream profile too
    try {
      await upsertStreamUser({
        id: updatedAccount._id.toString(),
        name: updatedAccount.fullName,
        image: updatedAccount.profilePic || "",
      });
      console.log(`Stream user updated after onboarding for ${updatedAccount.fullName}`);
    } catch (streamErr) {
      console.log("Error updating Stream user during onboarding:", streamErr.message);
    }

    res.status(200).json({ success: true, user: updatedAccount });
  } catch (err) {
    console.error("Onboarding error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
