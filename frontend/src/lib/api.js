import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const resSignup = await axiosInstance.post("/auth/signup", signupData);
  return resSignup.data;
};

export const login = async (loginData) => {
  const resLogin = await axiosInstance.post("/auth/login", loginData);
  return resLogin.data;
};

export const logout = async () => {
  const resLogout = await axiosInstance.post("/auth/logout");
  return resLogout.data;
};

export const getAuthUser = async () => {
  try {
    const resAuthUser = await axiosInstance.get("/auth/me");
    return resAuthUser.data;
  } catch (err) {
    console.log("Error in getAuthUser:", err);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const resOnboarding = await axiosInstance.post("/auth/onboarding", userData);
  return resOnboarding.data;
};

export async function getUserFriends() {
  const resFriends = await axiosInstance.get("/users/friends");
  return resFriends.data;
}

export async function getRecommendedUsers() {
  const resRecommended = await axiosInstance.get("/users");
  return resRecommended.data;
}

export async function getOutgoingFriendReqs() {
  const resOutgoing = await axiosInstance.get("/users/outgoing-friend-requests");
  return resOutgoing.data;
}

export async function sendFriendRequest(userId) {
  const resSendRequest = await axiosInstance.post(`/users/friend-request/${userId}`);
  return resSendRequest.data;
}

export async function getFriendRequests() {
  const resFriendReqs = await axiosInstance.get("/users/friend-requests");
  return resFriendReqs.data;
}

export async function acceptFriendRequest(requestId) {
  const resAccept = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return resAccept.data;
}

export async function getStreamToken() {
  const resToken = await axiosInstance.get("/chat/token");
  return resToken.data;
}
