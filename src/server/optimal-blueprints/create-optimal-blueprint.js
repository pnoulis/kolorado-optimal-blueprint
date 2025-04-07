import { db } from "../db.js";
import {
  generate_optimal_blueprint,
  make_optimal_blueprint_fileparts,
} from "../optimal-blueprint.js";
import {
  SQLGetBlueprintsWithRelations,
  formatBlueprintsTable,
} from "../blueprints/get-blueprints.js";

const SQLCreateOptimalBlueprint = db.prepare(
  "INSERT INTO optimal_blueprint (data) VALUES (?)",
);

async function createOptimalBlueprint(req, res) {
  const ctx = res.ctx;
  try {
    const targetShapes = req.body;
    const sourceBlueprints = formatBlueprintsTable(
      SQLGetBlueprintsWithRelations.all(-1, -1),
    );
    let optimalBlueprint = generate_optimal_blueprint(
      targetShapes,
      sourceBlueprints,
    );
    const sqlResponse = SQLCreateOptimalBlueprint.run(
      JSON.stringify(optimalBlueprint),
    );
    if (!sqlResponse.changes) {
      ctx.nok("Failed to create optimal blueprint");
      return res.status(500).json(ctx);
    }
    ctx.ok("Created optimal blueprint", optimalBlueprint);
    res.status(201).json(ctx);
  } catch (err) {
    ctx.nok("Failed to create optimal blueprint", err);
    res.status(500).json(ctx);
  }
}
export { createOptimalBlueprint };
