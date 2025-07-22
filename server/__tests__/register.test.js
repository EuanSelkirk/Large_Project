// server/__tests__/register.test.js
import request from "supertest";
import app from "../server.js";

describe("POST /api/auth/register", () => {
  it("creates a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuserasfvasfvafvavava",
      password: "Password123!@#",
      email: "test@examplee.com",
    });

    expect(res.statusCode).toBe(201);
  });
});
