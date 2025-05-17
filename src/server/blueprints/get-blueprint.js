const SQLGetBlueprint = globalThis.db.prepare("SELECT * FROM blueprint WHERE id=?");
const SQLGetBlueprintByName = globalThis.db.prepare(
  "SELECT * FROM blueprint WHERE name=?",
);
const SQLGetBlueprintWithRelations = globalThis.db.prepare(`
SELECT
   b.name AS blueprint_name,
   s.name AS shape_name,
   bs.count,
   bs.shape_id,
   bs.blueprint_id
FROM
   blueprint b
JOIN
   blueprint_shape bs ON bs.blueprint_id = b.id
JOIN
   shape s ON bs.shape_id = s.id
WHERE
   b.id=?
`);
const SQLGetBlueprintByNameWithRelations = globalThis.db.prepare(`
SELECT
   b.name AS blueprint_name,
   s.name AS shape_name,
   bs.count,
   bs.shape_id,
   bs.blueprint_id
FROM
   blueprint b
JOIN
   blueprint_shape bs ON bs.blueprint_id = b.id
JOIN
   shape s ON bs.shape_id = s.id
WHERE
   b.name=?
`);

async function getBlueprint(req, res) {
  const ctx = res.ctx;
  try {
    const TableBlueprint = SQLGetBlueprintWithRelations.all(req.params.id);
    if (!TableBlueprint) {
      ctx.nok("Missing blueprint", { id: req.params.id });
      return res.status(404).json(ctx);
    }
    const blueprint = {
      id: TableBlueprint[0].blueprint_id,
      name: TableBlueprint[0].blueprint_name,
      shapes: [],
    };
    for (const row of TableBlueprint) {
      blueprint.shapes.push({
        id: row.shape_id,
        name: row.shape_name,
        count: row.count,
      });
    }
    ctx.ok("Retrieved blueprint", blueprint);
    res.status(200).json(ctx);
  } catch (err) {
    ctx.nok(err.message, err);
    res.status(500).json(ctx);
  }
}

export {
  getBlueprint,
  SQLGetBlueprint,
  SQLGetBlueprintByName,
  SQLGetBlueprintWithRelations,
  SQLGetBlueprintByNameWithRelations,
};
