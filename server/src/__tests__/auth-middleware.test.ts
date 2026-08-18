process.env.JWT_SECRET = "test-secret";
import { Response } from "express";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { responseFormatter } from "../middleware/response";
import { signToken } from "../lib/jwt";

function mockReqRes(overrides: Partial<AuthedRequest> = {}) {
  const req = { headers: {}, cookies: {}, ...overrides } as AuthedRequest;
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  responseFormatter(req as any, res as Response, () => {});
  return { req, res: res as Response };
}

describe("requireAuth", () => {
  it("rejects a request with no token at all", () => {
    const { req, res } = mockReqRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an invalid/expired token", () => {
    const { req, res } = mockReqRes({ headers: { authorization: "Bearer garbage" } as any });
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("accepts a valid Bearer token and sets req.userId", () => {
    const token = signToken({ userId: "user_abc" });
    const { req, res } = mockReqRes({ headers: { authorization: `Bearer ${token}` } as any });
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(req.userId).toBe("user_abc");
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("accepts a valid token from the cookie when there's no Authorization header", () => {
    const token = signToken({ userId: "user_xyz" });
    const { req, res } = mockReqRes({ cookies: { token } });
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(req.userId).toBe("user_xyz");
    expect(next).toHaveBeenCalled();
  });
});
