import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const authToken = req.cookies.jwt;

    if (!authToken) {
      return res.status(401).json({ message: "Token Missing !" });
    }

    const decodedPayload = jwt.verify(authToken, process.env.JWT_SECRET_KEY);

    if (!decodedPayload) {
      return res.status(401).json({ message: "Invalid Token !" });
    }

    // Look up user by decoded userId
    const foundUser = await User.findById(decodedPayload.userId).select("-password");

    if (!foundUser) {
      return res.status(401).json({ message: "User Not Found !" });
    }

    // Attach user to request object for next handlers
    req.user = foundUser;

    next();
  } catch (err) {
    console.log("Error in auth middleware , Protected Route.", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
