process.env.JWT_SECRET = "test-secret";
import { signToken, verifyToken } from "../lib/jwt";

describe("jwt", () => {
  it("round-trips a payload through sign and verify", () => {
    const token = signToken({ userId: "user_123" });
    const payload = verifyToken(token);
    expect(payload.userId).toBe("user_123");
  });

  it("throws on a tampered token", () => {
    const token = signToken({ userId: "user_123" });
    const tampered = token.slice(0, -2) + "xx";
    expect(() => verifyToken(tampered)).toThrow();
  });

  it("throws on garbage input", () => {
    expect(() => verifyToken("not-a-real-token")).toThrow();
  });
});
