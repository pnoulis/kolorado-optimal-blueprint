import { describe, it, expect } from "@jest/globals";
import { randomString } from "../../random";

describe("GET shapes/count", () => {
  it("responds with the number of shapes", async () => {
    const res = await globalThis.api.get("shapes/count");
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(res.statusText).toBe("OK");
    expect(body.success).toBe(1);
    expect(body.data).toEqual(expect.any(Number));
  });
});
