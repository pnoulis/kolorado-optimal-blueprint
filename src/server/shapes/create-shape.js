import { db } from "../db.js";

const SQLCreateShape = db.prepare("INSERT INTO shape (name) VALUES (@name)");

async function createShape(req, res) {
  const ctx = res.ctx;
  try {
    const sqlResponse = SQLCreateShape.run(req.body);
    if (!sqlResponse.changes) {
      return res
        .status(500)
        .json(
          ctx.nok(
            `Failed to create shape: ${req.body.name}`,
            "Unknown exception",
          ),
        );
    }
    res.status(201).json(
      ctx.ok(`Successfully created shape: ${req.body.name}`, {
        id: sqlResponse.lastInsertRowid,
      }),
    );
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res
        .status(409)
        .json(ctx.nok(`Duplicate shape exists: ${req.body.name}`, err));
    } else {
      res
        .status(500)
        .json(ctx.nok(`Failed to create shape: ${req.body.name}`, err));
    }
  }
}
export { createShape };
