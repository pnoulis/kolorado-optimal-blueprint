import { db } from "../db.js";

const SQLGetBlueprints = db.prepare("SELECT * FROM blueprint");
const SQLGetBlueprintsWithRelations = db.prepare(`
SELECT
   b.name AS blueprint_name,
   b.created_at,
   s.name AS shape_name,
   bs.count,
   bs.shape_id,
   bs.blueprint_id
FROM (SELECT * FROM blueprint ORDER BY created_at DESC LIMIT ? OFFSET ?) as b
JOIN
   blueprint_shape bs ON bs.blueprint_id = b.id
JOIN
   shape s ON bs.shape_id = s.id
ORDER BY b.created_at DESC
`);

function formatBlueprintsTable(blueprintsTable) {
  const blueprints = new Map();
  let blueprint;
  for (const row of blueprintsTable) {
    blueprint = blueprints.get(row.blueprint_id);
    if (!blueprint) {
      blueprint = {
        id: row.blueprint_id,
        name: row.blueprint_name,
        shapes: [],
      };
      blueprints.set(blueprint.id, blueprint);
    }
    blueprint.shapes.push({
      id: row.shape_id,
      name: row.shape_name,
      count: row.count,
    });
  }
  return Array.from(blueprints.values());
}

async function getBlueprints(req, res) {
  const ctx = res.ctx;
  const batchSize = req.query.size || -1;
  const offset = req.query.page > 1 ? batchSize * (req.query.page - 1) : 0;
  try {
    const blueprintsTable = SQLGetBlueprintsWithRelations.all(batchSize, offset);
    ctx.ok("Retrieved blueprints", formatBlueprintsTable(blueprintsTable));
    res.status(200).json(ctx);
  } catch (err) {
    ctx.nok("Failed to get blueprints", err);
    res.status(500).json(ctx);
  }
}

export {
  getBlueprints,
  SQLGetBlueprints,
  SQLGetBlueprintsWithRelations,
  formatBlueprintsTable,
};
