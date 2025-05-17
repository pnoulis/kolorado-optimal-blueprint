import { SQLGetShapeByName } from "./get-shape.js";

const SQLCreateShape = globalThis.db.prepare(
  "INSERT INTO shape (name, description) VALUES (@name, @description)",
);

async function createShape(req, res) {
  const ctx = res.ctx;
  try {
    const sqlResponse = SQLCreateShape.run(req.body);
    if (!sqlResponse.changes) {
      ctx.nok("Failed to create shape", req.body);
      return res.status(500).json(ctx);
    }

    const shape = SQLGetShapeByName.get(req.body.name);
    if (!shape) {
      ctx.nok("Missing shape", req.body);
      return res.status(404).json(ctx);
    }
    ctx.ok("Created shape", shape);
    res.status(201).json(ctx);
  } catch (err) {
    switch (err.code) {
      case "SQLITE_CONSTRAINT_UNIQUE":
        ctx.nok("Duplicate shape exists", err);
        res.status(409).json(ctx);
        break;
      default:
        ctx.nok("Failed to create shape", err);
        res.status(500).json(ctx);
    }
  }
}

export { createShape, SQLCreateShape };
