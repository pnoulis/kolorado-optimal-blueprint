const SQLGetShapes = globalThis.db.prepare(`
SELECT * FROM shape ORDER BY created_at DESC LIMIT ? OFFSET ?
`);

async function getShapes(req, res) {
  const ctx = res.ctx;
  const limit = req.query.limit || -1;
  const offset = req.query.offset > 1 ? limit * (req.query.offset - 1) : 0;
  try {
    const shapes = SQLGetShapes.all(limit, offset);
    ctx.ok("Retrieved shapes", shapes);
    return res.status(200).json(ctx);
  } catch (err) {
    ctx.nok("Failed to get shapes", err);
    res.status(500).json(ctx);
  }
}

export { getShapes, SQLGetShapes };
