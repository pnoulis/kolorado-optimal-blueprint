import { db } from "../db.js";

const SQLGetShape = db.prepare("SELECT * FROM shape WHERE id=?");
const SQLGetShapeByName = db.prepare("SELECT * FROM shape WHERE name=?");

async function getShape(req, res) {
  const ctx = res.ctx;
  try {
    const shape = SQLGetShape.get(req.params.id);
    if (!shape) {
      ctx.nok("Missing shape", req.params);
      return res.status(404).json(ctx);
    }
    ctx.ok("Retrieved shape", shape);
    res.status(200).json(ctx);
  } catch (err) {
    ctx.nok("Failed to get shape", err);
    res.status(500).json(ctx);
  }
}

export { getShape, SQLGetShape, SQLGetShapeByName };
