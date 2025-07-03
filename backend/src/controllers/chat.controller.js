import { generateStreamToken } from "../lib/stream.js";

// Controller to get a Stream chat token
export async function getStreamToken(req, res) {
  try {
    const streamToken = generateStreamToken(req.user.id);

    res.status(200).json({ token: streamToken });
  } catch (err) {
    console.log("Error in getStreamToken controller:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
