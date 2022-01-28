// Write your tests here
const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");
const jokes = require("./jokes/jokes-data");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db.seed.run();
});
afterAll(async () => {
  await db.destroy();
});

test("sanity", () => {
  expect(true).toBe(true);
});

describe("[post] /auth/register", () => {
  test("[1] error message is user already exists", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "sagun", password: "12345" });
    expect(res.body.message).toMatch(/user already exists/i);
  });
  test("[2] error when no username", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "", password: "12345" });
    expect(res.body.message).toMatch(/please input both fields/i);
  });
  test("[3] error when no password", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "shrestha", password: "" });
    expect(res.body.message).toMatch(/please input both fields/i);
  });
  test("[4] responds with newly created user", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "shrestha", password: "12345" });
    expect(res.body).toMatchObject({ id: 2, username: "shrestha" });
  });
});

describe("[POST] /login",
  () => {
    test("[5] when no user exists displays correct error message", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "sagu", password: "12345" });
      expect(res.body.message).toMatch(/invalid credentials/i);
    });
    test("[6] when wrong password exists displays correct error message", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "sagun", password: "1234" });
      expect(res.body.message).toMatch(/invalid credentials/i);
    });
    test("[7] correct message when logged in", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "sagun", password: "12345" });
      expect(res.body.message).toMatch(/welcome sagun/i);
    });
});

describe("[GET] /jokes", () => {
  test("[8] when no token it gives correct error message", async () => {
    const res = await request(server).get("/api/jokes");
    expect(res.body.message).toMatch(/token required/i);
  });
  test("[9] when wrong token is sent correct error message", async () => {
    const res = await request(server)
      .get("/api/jokes")
      .set("Authorization", "nottherighttoken");
    expect(res.body.message).toMatch(/token invalid/i);
  });
  test("[10] correct token correct list", async () => {
    let res = await request(server)
      .post("/api/auth/login")
      .send({ username: "sagun", password: "12345" });
    res = await request(server)
      .get("/api/jokes")
      .set("Authorization", res.body.token);
    expect(res.body).toMatchObject(jokes);
  });
});
