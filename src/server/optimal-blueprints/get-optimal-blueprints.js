const SQLGetOptimalBlueprints = globalThis.db.prepare(`
SELECT * FROM optimal_blueprint ORDER BY created_at DESC LIMIT ? OFFSET ?
`);

async function getOptimalBlueprints(req, res) {
  const ctx = res.ctx;
  const batchSize = req.query.size || -1;
  const offset = req.query.page > 1 ? batchSize * (req.query.page - 1) : 0;
  try {
    const optimalBlueprints = SQLGetOptimalBlueprints.all(batchSize, offset);
    for (let i = 0; i < optimalBlueprints.length; i++) {
      optimalBlueprints[i] = {
        ...optimalBlueprints[i],
        ...JSON.parse(optimalBlueprints[i].data),
      };
      delete optimalBlueprints[i].data;
    }
    ctx.ok("Retrieved optimal blueprints", optimalBlueprints);
    return res.status(200).json(ctx);
  } catch (err) {
    ctx.nok("Failed to get optimal blueprints", err);
    res.status(500).json(ctx);
  }
}

export { getOptimalBlueprints, SQLGetOptimalBlueprints };
