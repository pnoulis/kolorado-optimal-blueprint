import { describe, it, expect } from "@jest/globals";
import { randomString } from "../../random";

describe("POST shape", () => {
  it("responds with a newly created shape", async () => {
    const res = await globalThis.api.post("shapes", {
      json: {
        name: randomString(),
        description: randomString(),
      },
    });
    const body = await res.json();
    expect(res.status).toBe(201);
    expect(res.statusText).toBe("Created");
    expect(body.success).toBe(1);
    expect(body.data.id).toEqual(expect.any(Number));
    expect(body.data.name).toEqual(expect.any(String));
    expect(body.data.description).toEqual(expect.any(String));
  });
});
