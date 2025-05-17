import { describe, it, expect } from "@jest/globals";
import { randomString } from "../../random";

describe("GET blueprints/count", () => {
  it("responds with the number of blueprints", async () => {
    const res = await globalThis.api.get("blueprints/count");
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(res.statusText).toBe("OK");
    expect(body.success).toBe(1);
    expect(body.data).toEqual(expect.any(Number));
  });
});
