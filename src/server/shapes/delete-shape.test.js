import { describe, it, expect } from "@jest/globals";
import { randomString } from "../../random";

describe("DELETE shape", () => {
  it("responds with the deleted shape ID", async () => {
    const shape = await globalThis.api
      .get("shapes?limit=1")
      .then((res) => res.json())
      .then((res) => res.data.pop());
    const res = await globalThis.api.delete("shapes/:id", {
      params: { id: shape.id },
    });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(res.statusText).toBe("OK");
    expect(body.success).toBe(1);
    expect(body.data.id).toBe(shape.id);
  });
});
