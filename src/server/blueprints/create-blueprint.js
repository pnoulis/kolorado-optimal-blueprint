import { SQLGetBlueprintByName } from "./get-blueprint.js";

const SQLCreateBlueprint = globalThis.db.prepare(
  "INSERT INTO blueprint (name) VALUES (@name)",
);
const SQLCreateBlueprintShape = globalThis.db.prepare(
  "INSERT INTO blueprint_shape (blueprint_id, shape_id, count) VALUES (@blueprint_id, @shape_id, @count)",
);

async function createBlueprint(req, res) {
  const ctx = res.ctx;
  let sqlResponse;
  try {
    sqlResponse = SQLCreateBlueprint.run(req.body);
    if (!sqlResponse.changes) {
      ctx.nok("Failed to create blueprint", req.body.name);
      return res.status(500).json(ctx);
    }
    const blueprint = SQLGetBlueprintByName.get(req.body.name);
    if (!blueprint) {
      ctx.nok("Failed to get blueprint", req.body.name);
      return res.status(404).json(ctx);
    }

    blueprint.shapes = [];
    for (const shape of req.body.shapes) {
      sqlResponse = SQLCreateBlueprintShape.run({
        blueprint_id: blueprint.id,
        shape_id: shape.id,
        count: shape.count,
      });
      if (!sqlResponse.changes) {
        ctx.nok("Failed to create blueprint shape", shape);
        continue;
      }
      blueprint.shapes.push({
        id: shape.id,
        count: shape.count,
      });
    }
    ctx.ok("Created blueprint", blueprint);
    return res.status(201).json(ctx);
  } catch (err) {
    ctx.nok('Failed to create blueprint', err);
    res.status(500).json(ctx);
  }
}
export { createBlueprint, SQLCreateBlueprint, SQLCreateBlueprintShape };
