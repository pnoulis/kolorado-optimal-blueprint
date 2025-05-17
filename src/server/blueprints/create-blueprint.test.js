import { describe, it, expect } from "@jest/globals";
import { randomString } from "../../random";

describe("POST blueprint", () => {
  it("responds with a newly created blueprint", async () => {
    const res = await globalThis.api.post("blueprints", {
      json: {
        name: randomString(),
        shapes: [{ id: 1, count: 3 }],
      },
    });
    const body = await res.json();
    expect(res.status).toBe(201);
    expect(res.statusText).toBe("Created");
    expect(body.success).toBe(1);
    expect(body.data.id).toEqual(expect.any(Number));
    expect(body.data.name).toEqual(expect.any(String));
    expect(body.data.shapes).toEqual(
      expect.arrayContaining([
        {
          id: 1,
          count: 3,
        },
      ]),
    );
  });
});
