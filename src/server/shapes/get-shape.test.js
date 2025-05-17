import { describe, it, expect } from "@jest/globals";

describe("GET shape", () => {
  it("responds with a shape", async () => {
    const res = await globalThis.api.get("shapes/:id", {
      params: { id: 1 },
    });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(res.statusText).toBe("OK");
    expect(body.success).toBe(1);
    expect(body.data).toEqual(expect.any(Object));
    expect(body.data.id).toBe(1);
    expect(body.data.name).toEqual(expect.any(String));
    expect(body.data.description).toBeDefined();
  });
});
