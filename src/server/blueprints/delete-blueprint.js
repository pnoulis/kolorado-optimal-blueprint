import { db } from "../db.js";

const SQLDeleteBlueprint = db.prepare("DELETE FROM blueprint WHERE id=?");

async function deleteBlueprint(req, res) {
  const ctx = res.ctx;
  try {
    const sqlResponse = SQLDeleteBlueprint.run(req.params.id);
    if (sqlResponse.changes === 0) {
      ctx.nok("Failed to delete blueprint", req.params);
      return res.status(404).json(ctx);
    }
    ctx.ok("Deleted blueprint", req.params);
    res.status(200).json(ctx);
  } catch (err) {
    ctx.nok("Failed to delete blueprint", err);
    res.status(500).json(ctx);
  }
}

export { deleteBlueprint, SQLDeleteBlueprint };
