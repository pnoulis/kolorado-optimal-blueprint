import { debug } from "../../debug.js";
import { db } from "../db.js";

const SQLCreateShape = db.prepare("INSERT INTO shape (name) VALUES (@name)");

async function createShape(req, res, next) {
  const ctx = res.locals.ctx;
  try {
    const sqlResponse = SQLCreateShape.run(req.body);
    if (!sqlResponse.changes) {
      ctx
        .status(500)
        .nok(`Failed to create shape: ${req.body.name}`, "Unknown exception");
      return next();
    }
    ctx.status(201).ok(`Successfully created shape: ${req.body.name}`, {
      id: sqlResponse.lastInsertRowid,
    });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      ctx.status(409).nok(`Duplicate shape exists: ${req.body.name}`, err);
    } else {
      ctx.status(500).nok(`Failed to create shape: ${req.body.name}`, err);
    }
  }

  return next();
}
export { createShape };
