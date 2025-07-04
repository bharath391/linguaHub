const axios = require("axios");

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

// Generates a unique email each time you run
const randomEmail = () =>
  `testuser_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;

// Helper to assert and print on mismatch
function expectStatus(res, expectedStatus) {
  if (res.status !== expectedStatus) {
    console.log(`EXPECTED: ${expectedStatus} | RECEIVED: ${res.status}`, res.data);
  }
  expect(res.status).toBe(expectedStatus);
}

describe("Auth API Tests", () => {
  let cookie;
  const signupEmail = randomEmail();
  const loginEmail = randomEmail();

  test("Signup - missing fields should fail", async () => {
    const res = await api.post("/auth/signup", { email: "", password: "", fullName: "" }).catch(e => e.response);
    expectStatus(res, 400);
  });

  test("Signup - invalid email should fail", async () => {
    const res = await api
      .post("/auth/signup", {
        email: "not-an-email",
        password: "testpass123",
        fullName: "test",
      })
      .catch(e => e.response);
    expectStatus(res, 400);
  });

  test("Signup - short password should fail", async () => {
    const res = await api
      .post("/auth/signup", {
        email: randomEmail(),
        password: "123",
        fullName: "test",
      })
      .catch(e => e.response);
    expectStatus(res, 400);
  });

  test("Signup - success", async () => {
    const res = await api.post("/auth/signup", {
      email: signupEmail,
      password: "testpass123",
      fullName: "test new user",
    });
    expectStatus(res, 201);
  });

  test("Signup - duplicate email should fail", async () => {
    const res = await api
      .post("/auth/signup", {
        email: signupEmail,
        password: "testpass123",
        fullName: "test duplicate",
      })
      .catch(e => e.response);
    expectStatus(res, 400);
  });

  test("Login - missing fields should fail", async () => {
    const res = await api.post("/auth/login", { email: "", password: "" }).catch(e => e.response);
    expectStatus(res, 400);
  });

  test("Login - wrong email should fail", async () => {
    const res = await api
      .post("/auth/login", {
        email: "nonexistent_" + randomEmail(),
        password: "testpass123",
      })
      .catch(e => e.response);
    expectStatus(res, 401);
  });

  test("Login - wrong password should fail", async () => {
    const res = await api
      .post("/auth/login", {
        email: signupEmail,
        password: "wrongpass",
      })
      .catch(e => e.response);
    expectStatus(res, 401);
  });

  test("Login - success", async () => {
    // First signup this user
    await api.post("/auth/signup", {
      email: loginEmail,
      password: "testpass123",
      fullName: "login test user",
    });

    const res = await api.post("/auth/login", {
      email: loginEmail,
      password: "testpass123",
    });
    expectStatus(res, 200);

    cookie = res.headers["set-cookie"];
  });

  test("Onboarding - missing fields should fail", async () => {
    const res = await api
      .post(
        "/auth/onboarding",
        { fullName: "", bio: "", nativeLanguage: "", learningLanguage: "", location: "" },
        { headers: { Cookie: cookie } }
      )
      .catch(e => e.response);
    expectStatus(res, 400);
  });

  test("Onboarding - success", async () => {
    const res = await api.post(
      "/auth/onboarding",
      {
        fullName: "test onboarded user",
        bio: "I am learning languages",
        nativeLanguage: "English",
        learningLanguage: "Spanish",
        location: "Test City",
      },
      { headers: { Cookie: cookie } }
    );
    expectStatus(res, 200);
  });
});
