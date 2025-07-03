import { StreamChat } from "stream-chat";
import "dotenv/config";

const streamApiKey = process.env.STEAM_API_KEY;
const streamApiSecret = process.env.STEAM_API_SECRET;

if (!streamApiKey || !streamApiSecret) {
  console.error("Stream API key or Secret is missing");
}

// Initialize Stream client instance
const chatClient = StreamChat.getInstance(streamApiKey, streamApiSecret);

// Create or update a user in Stream
export const upsertStreamUser = async (userInfo) => {
  try {
    await chatClient.upsertUsers([userInfo]);
    return userInfo;
  } catch (err) {
    console.error("Error upserting Stream user:", err);
  }
};

// Generate a Stream token for the given user ID
export const generateStreamToken = (userId) => {
  try {
    const userIdStr = userId.toString();
    return chatClient.createToken(userIdStr);
  } catch (err) {
    console.error("Error generating Stream token:", err);
  }
};
