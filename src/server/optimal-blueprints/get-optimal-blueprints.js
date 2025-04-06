import { db } from "../db.js";

const SQLGetOptimalBlueprints = db.prepare("SELECT * FROM optimal_blueprint");

async function getOptimalBlueprints(req, res) {
  const ctx = res.ctx;
  try {
    const optimalBlueprints = SQLGetOptimalBlueprints.all();
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
