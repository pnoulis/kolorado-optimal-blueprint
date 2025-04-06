import { db } from "../db.js";

const SQLGetShapes = db.prepare("SELECT * FROM shape");

async function getShapes(req, res) {
  const ctx = res.ctx;
  try {
    const shapes = SQLGetShapes.all();
    ctx.ok("Retrieved shapes", shapes);
    return res.status(200).json(ctx);
  } catch (err) {
    ctx.nok("Failed to get shapes", err);
    res.status(500).json(ctx);
  }
}

export { getShapes, SQLGetShapes };
