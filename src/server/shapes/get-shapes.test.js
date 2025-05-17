import { describe, it, expect } from "@jest/globals";

describe("GET shapes", () => {
  it("responds with a list of shapes", async () => {
    const res = await globalThis.api.get("shapes");
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(res.statusText).toBe("OK");
    expect(body.success).toBe(1);
    expect(Array.isArray(body.data)).toBe(true);
  });
});
