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

describe("Chat API Tests", () => {
  let userCookie;
  const email = randomEmail();

  beforeAll(async () => {
    await api.post("/auth/signup", {
      email,
      password: "testpass123",
      fullName: "Chat Test User",
    });

    const res = await api.post("/auth/login", {
      email,
      password: "testpass123",
    });
    expectStatus(res, 200);
    userCookie = res.headers["set-cookie"];
  });

  test("Get Stream token", async () => {
    const res = await api.get("/chat/token", { headers: { Cookie: userCookie } });
    expectStatus(res, 200);
    expect(res.data).toHaveProperty("token");
  });
});
