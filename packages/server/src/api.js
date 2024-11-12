import { Router } from "express";
import { db } from "./sqlite.js";
import { blueprint, shape } from "common";
import { createBlueprintsPage, createShapesPage } from "./pages.js";

const api = Router();

api.get("/optimal-blueprint", (req, res) => {});

/**
 * @param {Object} req.params
 * @param {String} [req.params.className]
 * @param {Object} req.query
 * @param {String} [req.query.id]
 * @param {String} [req.query.name]
 * @returns {Object<shapes,blueprints>}
 */
api.get("/:className?", (req, res) => {
  const { className } = req.params;
  const { id, name } = req.query;
  let shapes, key;

  if (id) {
    shapes = id.split(",");
    key = "id";
  } else if (name) {
    shapes = name.split(",");
    key = "name";
  }

  let data;
  switch (className) {
    case "shapes": /* fall through */
    case "shape":
      data = db.getShapes(shapes, key);
      break;
    case "blueprints": /* fall through */
    case "blueprint":
      data = db.getBlueprints(shapes, key);
      break;
    default:
      data = {
        blueprints: db.getBlueprints(shapes, key),
        shapes: db.getShapes(shapes, key),
      };
  }
  res.send(data);
});

/**
 * @param {Object} req.body
 * @param {String} req.body.name
 * @returns {Object<changes,lastInsertRowId>}
 */
api.post("/shapes?", (req, res) => {
  const info = db.createShapes({
    name: req.body.name,
    state: shape.states.active,
  });
  createShapesPage();
  res.status(201).send(info);
});

/**
 * @param {Object} req.body
 * @param {String} req.body.name
 * @param {Array<name,count>} req.body.shapes
 * @returns {Object<changes,lastInsertRowId>}
 */
api.post("/blueprints?", (req, res) => {
  const { className } = req.params;
  const info = db.createBlueprints({
    name: req.body.name,
    state: shape.states.active,
  });
  createBlueprintsPage();
  res.status(201).send(info);
});
api.put("/:className", (req, res) => {
  const { className, id } = req.params;
  const { key } = req.query;
});
api.delete("/:className", (req, res) => {
  const { className, id } = req.params;
});

export { api };
