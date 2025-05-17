const SQLCountBlueprints = globalThis.db.prepare(
  "SELECT COUNT(*) FROM blueprint",
);

async function countBlueprints(req, res) {
  const ctx = res.ctx;
  try {
    const count = SQLCountBlueprints.raw(true).get();
    ctx.ok("Counted blueprints", count.pop());
    res.status(200).json(ctx);
  } catch (err) {
    ctx.nok("Failed to count blueprints", err);
    res.status(500).json(ctx);
  }
}

export { SQLCountBlueprints, countBlueprints };
