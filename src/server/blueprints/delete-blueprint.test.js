import { describe, it, expect } from "@jest/globals";
import { randomString } from "../../random";

describe("DELETE blueprint", () => {
  it("responds with the deleted blueprint ID", async () => {
    const blueprint = await globalThis.api
      .get("blueprints?limit=1")
      .then((res) => res.json())
      .then((res) => res.data.pop());
    const res = await globalThis.api.delete("blueprints/:id", {
      params: { id: blueprint.id },
    });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(res.statusText).toBe("OK");
    expect(body.success).toBe(1);
    expect(body.data.id).toEqual(blueprint.id);
  });
});
