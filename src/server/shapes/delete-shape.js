import { db } from "../db.js";

const SQLDeleteShape = db.prepare("DELETE FROM shape WHERE id=?");

async function deleteShape(req, res) {
  const ctx = res.ctx;
  try {
    const sqlResponse = SQLDeleteShape.run(req.params.id);
    if (sqlResponse.changes === 0) {
      ctx.nok("Failed to delete shape", req.params);
      return res.status(404).json(ctx);
    }
    ctx.ok("Deleted shape", req.params);
    res.status(200).json(ctx);
  } catch (err) {
    ctx.nok("Failed to delete shape", err);
    res.status(500).json(ctx);
  }
}

export { deleteShape, SQLDeleteShape };
