const SQLCountShapes = globalThis.db.prepare("SELECT COUNT(*) FROM shape");

async function countShapes(req, res) {
  const ctx = res.ctx;
  try {
    const count = SQLCountShapes.raw(true).get();
    ctx.ok("Counted shapes", count.pop());
    res.status(200).json(ctx);
  } catch (err) {
    ctx.nok("Failed to count shapes", err);
    res.status(500).json(ctx);
  }
}

export { SQLCountShapes, countShapes };
