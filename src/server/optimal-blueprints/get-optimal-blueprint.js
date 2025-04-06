import { db } from "../db.js";

const SQLGetOptimalBlueprint = db.prepare(
  "SELECT * FROM optimal_blueprint WHERE id=?",
);

async function getOptimalBlueprint(req, res) {
  const ctx = res.ctx;
  try {
    let optimalBlueprint = SQLGetOptimalBlueprint.get(req.params.id);
    if (!optimalBlueprint) {
      ctx.nok("Missing optimal blueprint", req.params);
      return res.status(404).json(ctx);
    }
    optimalBlueprint = {
      ...optimalBlueprint,
      ...JSON.parse(optimalBlueprint.data),
    };
    delete optimalBlueprint.data;
    ctx.ok("Retrieved optimal blueprint", optimalBlueprint);
    res.status(200).json(ctx);
  } catch (err) {
    ctx.nok("Failed to get optimal blueprint", err);
    res.status(500).json(ctx);
  }
}

export { getOptimalBlueprint, SQLGetOptimalBlueprint };
