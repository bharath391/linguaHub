import express from "express";
import { 
  login as handleLogin, 
  logout as handleLogout, 
  onboard as handleOnboarding, 
  signup as handleSignup 
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

// User signup endpoint
authRouter.post("/signup", handleSignup);

// User login endpoint
authRouter.post("/login", handleLogin);

// User logout endpoint
authRouter.post("/logout", handleLogout);

// Onboarding route with protection middleware
authRouter.post("/onboarding", protectRoute, handleOnboarding);

// Quick check to see if user is authenticated
authRouter.get("/me", protectRoute, (req, res) => {
  // Sending back the logged-in user info
  res.status(200).json({
    success: true,
    user: req.user
  });
});

export default authRouter;
