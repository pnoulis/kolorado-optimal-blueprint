import { describe, it, expect } from "@jest/globals";

describe("GET blueprint", () => {
  it("responds with a blueprint", async () => {
    const res = await globalThis.api.get("blueprints/:id", {
      params: { id: 1 },
    });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(res.statusText).toBe("OK");
    expect(body.success).toBe(1);
    expect(body.data).toEqual(expect.any(Object));
    expect(body.data.id).toBe(1);
    expect(body.data.name).toEqual(expect.any(String));
    expect(Array.isArray(body.data.shapes)).toBe(true);
  });
});
