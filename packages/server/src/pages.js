import ejs from "ejs";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { db } from "./sqlite.js";

function createPage(template, destination, data) {
  template = readFileSync(template, { encoding: "utf8" });
  const page = ejs.render(template, data, {
    async: false,
    cache: false,
    rmWhitespace: true,
    views: [process.env.PUBLICDIR],
  });
  writeFileSync(destination, page, { encoding: "utf8" });
  return destination;
}

function createBlueprintsPage(data) {
  data ||= {};
  return createPage(
    join(process.env.PUBLICDIR, "blueprints.ejs"),
    join(process.env.PUBLICDIR, "blueprints.html"),
    {
      blueprints: data.blueprints || db.getBlueprints(),
      shapes: data.shapes || db.getShapes(),
    },
  );
}

function createShapesPage(data) {
  data ||= {};
  return createPage(
    join(process.env.PUBLICDIR, "shapes.ejs"),
    join(process.env.PUBLICDIR, "shapes.html"),
    {
      shapes: data.shapes || db.getShapes(),
    },
  );
}

function createHomePage(data) {
  data ||= {};
  return createPage(
    join(process.env.PUBLICDIR, "home.ejs"),
    join(process.env.PUBLICDIR, "index.html"),
    {
      shapes: data.shapes || db.getShapes(),
    },
  );
}

function createOptimalBlueprintPage(data, destination) {
  return createPage(
    join(process.env.PUBLICDIR, "optimal-blueprint.ejs"),
    destination,
    data,
  );
}

function createOptimalBlueprintReport(data, destination) {
  let str = `STATISTICS
--------------------------------------------------------------------------------
total number of requested shapes: ${data.target_shapes_total_count}
unique number of requested shapes: ${data.target_shapes_unique_count}
total number of optimal blueprints: ${data.optimal_blueprints_total_count}
unique number of optimal blueprints: ${data.optimal_blueprints_unique_count}
total number of optimal shapes: ${data.optimal_shapes_total_count}
unique number of optimal shapes: ${data.optimal_shapes_unique_count}
total number of remainder shapes: ${data.remainder}

OPTIMAL BLUEPRINTS
--------------------------------------------------------------------------------
`;

  for (let i = 0; i < data.optimal_blueprints_unique.length; i++) {
    str += `${data.optimal_blueprints_unique[i].name || data.optimal_blueprints_unique[i].id}: ${data.optimal_blueprints_unique[i].count}
`;
  }

  str += `
REMAINDER SHAPES
--------------------------------------------------------------------------------
`;

  for (let i = 0; i < data.optimal_shapes_remainder.length; i++) {
    str += `${data.optimal_shapes_remainder[i].name || data.optimal_shapes_remainder[i].id}: ${data.optimal_shapes_remainder[i].count}
`;
  }

  str += `
TARGET SHAPES
--------------------------------------------------------------------------------
`;

  for (let i = 0; i < data.target_shapes_unique.length; i++) {
    str += `${data.target_shapes_unique[i].name || data.target_shapes_unique[i].id}: ${data.target_shapes_unique[i].count}
`;
  }

  writeFileSync(destination, str, { encoding: "utf8" });
  return destination;
}

export {
  createPage,
  createBlueprintsPage,
  createShapesPage,
  createHomePage,
  createOptimalBlueprintPage,
  createOptimalBlueprintReport,
};
