const axios = require("axios");

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

// Helpers
function randomEmail() {
  return `test_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;
}

function expectStatus(res, expectedStatus) {
  if (res.status !== expectedStatus) {
    console.log(`EXPECTED: ${expectedStatus} | RECEIVED: ${res.status}`, res.data);
  }
  expect(res.status).toBe(expectedStatus);
}

describe("User API Tests", () => {
  let userACookie, userBCookie, friendRequestId;

  const emailA = randomEmail();
  const emailB = randomEmail();

  beforeAll(async () => {
    // Signup User A
    await api.post("/auth/signup", {
      email: emailA,
      password: "testpass123",
      fullName: "Test User A",
    });

    // Signup User B
    await api.post("/auth/signup", {
      email: emailB,
      password: "testpass123",
      fullName: "Test User B",
    });

    // Login User A
    const resA = await api.post("/auth/login", {
      email: emailA,
      password: "testpass123",
    });
    expectStatus(resA, 200);
    userACookie = resA.headers["set-cookie"];

    // Login User B
    const resB = await api.post("/auth/login", {
      email: emailB,
      password: "testpass123",
    });
    expectStatus(resB, 200);
    userBCookie = resB.headers["set-cookie"];

    // Onboard User A (makes them show up in recommended users)
    await api.post(
      "/auth/onboarding",
      {
        fullName: "Test User A",
        bio: "Test bio",
        nativeLanguage: "English",
        learningLanguage: "Spanish",
        location: "Earth",
      },
      { headers: { Cookie: userACookie } }
    );

    // Onboard User B
    await api.post(
      "/auth/onboarding",
      {
        fullName: "Test User B",
        bio: "Test bio",
        nativeLanguage: "English",
        learningLanguage: "Spanish",
        location: "Earth",
      },
      { headers: { Cookie: userBCookie } }
    );
  });

  test("Get recommended users", async () => {
    const res = await api.get("/users", { headers: { Cookie: userACookie } });
    expectStatus(res, 200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test("User A sends friend request to User B", async () => {
    // Get B userId from recommended users
    const recommended = await api.get("/users", { headers: { Cookie: userACookie } });
    const recipient = recommended.data.find(u => u.email === emailB);
    expect(recipient).toBeTruthy();

    const res = await api.post(
      `/users/friend-request/${recipient._id}`,
      {},
      { headers: { Cookie: userACookie } }
    );
    expectStatus(res, 201);
    friendRequestId = res.data._id;
  });

  test("User B accepts friend request", async () => {
    const res = await api.put(
      `/users/friend-request/${friendRequestId}/accept`,
      {},
      { headers: { Cookie: userBCookie } }
    );
    expectStatus(res, 200);
  });

  test("Get my friends", async () => {
    const res = await api.get("/users/friends", { headers: { Cookie: userACookie } });
    expectStatus(res, 200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test("Get incoming friend requests", async () => {
    const res = await api.get("/users/friend-requests", { headers: { Cookie: userACookie } });
    expectStatus(res, 200);
  });

  test("Get outgoing friend requests", async () => {
    const res = await api.get("/users/outgoing-friend-requests", { headers: { Cookie: userACookie } });
    expectStatus(res, 200);
  });
});
