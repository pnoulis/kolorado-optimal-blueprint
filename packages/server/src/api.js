import { Router } from "express";
import { db } from "./sqlite.js";
import { blueprint, shape } from "common";
import { createBlueprintsPage, createShapesPage } from "./pages.js";

const api = Router();

api.get("/optimal-blueprint", (req, res) => {});

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
    case "shape":
      data = db.getShapes(shapes, key);
      break;
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
api.post("/shapes?", (req, res) => {
  const info = db.createShapes({
    name: req.body.name,
    state: shape.states.active,
  });
  createShapesPage();
  res.send(info);
});
api.post("/blueprints?", (req, res) => {
  const { className } = req.params;
});
api.put("/:className", (req, res) => {
  const { className, id } = req.params;
  const { key } = req.query;
});
api.delete("/:className", (req, res) => {
  const { className, id } = req.params;
});

export { api };
