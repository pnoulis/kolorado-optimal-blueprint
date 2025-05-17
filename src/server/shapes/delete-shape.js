const SQLDeleteShape = globalThis.db.prepare("DELETE FROM shape WHERE id=?");
const SQLGetBlueprintsOfDeletedShape = globalThis.db.prepare(`
SELECT
   b.id,
   b.name
FROM blueprint_shape AS bs
JOIN blueprint b ON bs.blueprint_id = b.id
WHERE bs.shape_id = ?
`);

async function deleteShape(req, res) {
  const ctx = res.ctx;
  try {
    const sqlResponse = SQLDeleteShape.run(req.params.id);
    if (sqlResponse.changes === 0) {
      ctx.nok("Failed to delete shape", {
        id: parseInt(req.params.id),
      });
      return res.status(404).json(ctx);
    }
    ctx.ok("Deleted shape", {
      id: parseInt(req.params.id),
    });
    res.status(200).json(ctx);
  } catch (err) {
    switch (err.code) {
      case "SQLITE_CONSTRAINT_FOREIGNKEY":
        // The user tried to delete a Shape referenced by at least one
        // Blueprint
        const blueprints = SQLGetBlueprintsOfDeletedShape.all(req.params.id);
        ctx.nok("Failed to delete shape used by active blueprints", blueprints);
        break;
      default:
        ctx.nok("Failed to delete shape", err);
        res.status(500).json(ctx);
    }
  }
}

export { deleteShape, SQLDeleteShape, SQLGetBlueprintsOfDeletedShape };
