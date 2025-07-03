import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken as fetchStreamToken } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

// Route to get a chat stream token
chatRouter.get("/token", protectRoute, fetchStreamToken);

// Exporting the router for chat features
export default chatRouter;
