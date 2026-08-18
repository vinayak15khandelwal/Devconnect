import { Request, Response } from "express";
import { responseFormatter } from "../middleware/response";

function mockRes() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

describe("responseFormatter", () => {
  it("attaches success() which sends {success:true, data, message}", () => {
    const res = mockRes();
    const next = jest.fn();
    responseFormatter({} as Request, res, next);

    res.success({ id: 1 }, "Created");

    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 1 }, message: "Created" });
    expect(next).toHaveBeenCalled();
  });

  it("success() defaults message to 'OK' when omitted", () => {
    const res = mockRes();
    responseFormatter({} as Request, res, jest.fn());

    res.success({ id: 1 });

    expect(res.json).toHaveBeenCalledWith({ success: true, data: { id: 1 }, message: "OK" });
  });

  it("attaches fail() which sends {success:false, message} with the given status", () => {
    const res = mockRes();
    responseFormatter({} as Request, res, jest.fn());

    res.fail("Not found", 404);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Not found" });
  });

  it("fail() defaults to a 400 status when omitted", () => {
    const res = mockRes();
    responseFormatter({} as Request, res, jest.fn());

    res.fail("Bad input");

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
