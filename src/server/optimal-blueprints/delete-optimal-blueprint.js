const SQLDeleteOptimalBlueprint = globalThis.db.prepare(
  "DELETE FROM optimal_blueprint WHERE id=?",
);

async function deleteOptimalBlueprint(req, res) {
  const ctx = res.ctx;
  try {
    const sqlResponse = SQLDeleteOptimalBlueprint.run(req.params.id);
    if (sqlResponse.changes === 0) {
      ctx.nok("Failed to delete optimal blueprint", req.params);
      return res.status(404).json(ctx);
    }
    ctx.ok("Deleted optimal blueprint", req.params);
    res.status(200).json(ctx);
  } catch (err) {
    ctx.nok("Failed to delete optimal blueprint", err);
    res.status(500).json(ctx);
  }
}

export { deleteOptimalBlueprint, SQLDeleteOptimalBlueprint };
