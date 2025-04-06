import { db } from "../db.js";

const SQLDeleteShape = db.prepare("DELETE FROM shape WHERE id=?");

async function deleteShape(req, res) {
  const ctx = res.ctx;
  try {
    const sqlResponse = SQLDeleteShape.run(req.params.id);
    if (sqlResponse.changes === 0) {
      return res.status(404).json(
        ctx.nok("Failed to delete shape", {
          id: req.params.id,
        }),
      );
    }
    res.status(200).json(ctx.ok("Deleted shape", sqlResponse));
  } catch (err) {
    res.status(500).json(ctx.nok(err.message, err));
  }
}
export { deleteShape };
