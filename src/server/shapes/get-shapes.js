import { db } from "../db.js";

const SQLGetShapes = db.prepare(`
SELECT * FROM shape ORDER BY created_at DESC LIMIT ? OFFSET ?
`);

async function getShapes(req, res) {
  const ctx = res.ctx;
  const batchSize = req.query.size || -1;
  const offset = req.query.page > 1 ? batchSize * (req.query.page - 1) : 0;
  try {
    const shapes = SQLGetShapes.all(batchSize, offset);
    ctx.ok("Retrieved shapes", shapes);
    return res.status(200).json(ctx);
  } catch (err) {
    ctx.nok("Failed to get shapes", err);
    res.status(500).json(ctx);
  }
}

export { getShapes, SQLGetShapes };
