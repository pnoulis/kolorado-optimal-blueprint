import { blueprint, shape } from "common";
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
      blueprints: data.shapes || db.getBlueprints(),
      states: data.states || blueprint.states,
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
      states: data.states || shape.states,
    },
  );
}

export { createPage, createBlueprintsPage, createShapesPage };
