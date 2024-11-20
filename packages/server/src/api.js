import { Router } from "express";
import { db } from "./sqlite.js";
import { Blueprint, Kerror, Shape } from "common";
import { createBlueprintsPage, createShapesPage } from "./pages.js";

const api = Router();

api.get("/optimal-blueprint", (req, res) => {});

/**
 * @param {Object} req.params
 * @param {string} [req.params.className]
 * @param {Object} req.query
 * @param {string} [req.query.id]
 * @param {string} [req.query.name]
 * @returns {Object<shapes,blueprints>}
 */
api.get("/:className?", (req, res) => {
  const { className } = req.params;
  const { id, name } = req.query;
  let ids, key;

  if (id) {
    ids = id.split(",");
    key = "id";
  } else if (name) {
    ids = name.split(",");
    key = "name";
  }
  let data;
  switch (className) {
    case "shapes":
    case "shape":
      data = db.getShapes(ids, key);
      break;
    case "blueprints":
    case "blueprint":
      data = db.getBlueprints(ids, key);
      break;
    default:
      data = {
        blueprints: db.getBlueprints(),
        shapes: db.getShapes(),
      };
  }
  res.send(data);
});

/**
 * @param {(Shape[]|Shape)} req.body
 */
api.post("/shapes", (req, res) => {
  const shapes = [req.body].flat();
  const created = [];
  const notCreated = [];

  for (let i = 0; i < shapes.length; i++) {
    let sqliteResponse, cause, status;
    try {
      sqliteResponse = db.createShape(shapes[i]);
    } catch (err) {
      debug()(err);
      if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
        cause = `Duplicate shape '${shapes[i].name}' exists!`;
        status = 403;
      } else {
        cause = err.message;
        status = err.code;
      }
    }

    if (sqliteResponse?.changes) {
      created.push({
        message: `Successfully created shape: ${shapes[i].name}`,
        status: 201,
        error: 0,
        data: {
          ...shapes[i],
          id: sqliteResponse.lastInsertRowid,
        },
      });
    } else {
      notCreated.push({
        message: `Failed to create shape: ${shapes[i].name}`,
        status: status || 500,
        error: 1,
        errors: cause || "Internal Server Error",
        data: shapes[i],
      });
    }
  }

  if (created.length) createShapesPage();
  res.status(notCreated.length ? 207 : 201).send([...created, ...notCreated]);
});

/**
 * @param {(Shape[]|Shape|string[]|Object>)} req.body
 * @param {(Shape[]|Shape|string[])} [req.body.shapes]
 * @param {string} [req.body.key=id] - Declares which property of a
 * Shape each element refers to. (It only makes sense when used with a
 * body that has an Array of strings in the req.body.shapes property)
 * @example
 * req.body.shapes = [1,2], req.body.key=id
 * Each element of the input refers to a shape id
 * @example
 * req.body.shapes = [Triangle, Circle], req.body.key=name
 * Each element of the input refers to a shape name
 */
api.delete("/shapes", (req, res) => {
  const shapes = [req.body.shapes || req.body].flat();
  const KEY = req.body.key || "id";
  const deleted = [];
  const notDeleted = [];

  for (let i = 0; i < shapes.length; i++) {
    let sqliteResponse, key, shape, cause, status;
    shape = shapes[i].name || shapes[i].id || shapes[i];
    key = shape.id ? "id" : shape.name ? "name" : KEY;
    try {
      sqliteResponse = db.deleteShape(shape, key);
    } catch (err) {
      debug()(err);
      if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
        cause = `Shape '${shape}' is part of a Blueprint!`;
        status = 403;
      } else {
        cause = err.message;
        status = err.code;
      }
    }
    if (sqliteResponse?.changes) {
      deleted.push({
        message: `Successfully deleted shape: ${shape}`,
        status: 200,
        error: 0,
        data: shapes[i],
      });
    } else {
      notDeleted.push({
        message: `Failed to delete shape: ${shape}`,
        status: status || 500,
        error: 1,
        errors: cause || "Internal Server Error",
        data: shape[i],
      });
    }
  }

  if (deleted.length) {
    createShapesPage();
    createBlueprintsPage();
  }
  res.status(notDeleted.length ? 207 : 200).send([...deleted, ...notDeleted]);
});

/**
 * @param {(Blueprint[]|Blueprint)} req.body
 */
api.post("/blueprints", (req, res) => {
  const blueprints = [req.body].flat();
  const created = [];
  const notCreated = [];

  for (let i = 0; i < blueprints.length; i++) {
    let sqliteResponse, cause, status, id;
    const errors = [];
    try {
      sqliteResponse = db.createBlueprint(blueprints[i]);
    } catch (err) {
      debug()(err);
      if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
        cause = `Duplicate blueprint '${blueprints[i].name}' exists!`;
        status = 403;
      } else {
        cause = err.message;
        status = err.code;
      }
    }

    if (!sqliteResponse?.changes) {
      notCreated.push({
        message: `Failed to create blueprint: ${blueprints[i].name}`,
        status: status || 500,
        error: 1,
        errors: cause || "Internal Server Error",
        data: blueprints[i],
      });
      continue;
    }

    id = sqliteResponse.lastInsertRowid;

    for (let y = 0; y < blueprints[i].shapes.length; y++) {
      sqliteResponse = null;
      try {
        sqliteResponse = db.createBlueprintShape({
          id,
          shape_id: blueprints[i].shapes[y].id,
          count: blueprints[i].shapes[y].count,
        });
      } catch (err) {
        debug()(err);
        cause = err.message;
        status = err.code;
      }
      if (sqliteResponse?.changes) continue;
      errors.push({
        message: `Failed to add ${blueprints[i].shapes[y].count} x ${blueprints[i].shapes[y].id} shapes in blueprint: ${blueprints[i].name}`,
        status: status || 500,
        cause: cause || "Internal Server Error",
      });
    }
    created.push({
      message: `Successfully created blueprint: ${blueprints[i].name}`,
      status: 201,
      error: errors.length ? 1 : 0,
      errors,
      data: {
        ...blueprints[i],
        id,
      },
    });
  }
  if (created.length) createBlueprintsPage();
  res.status(notCreated.length ? 207 : 201).send([...created, ...notCreated]);
});

/**
 * @param {(Blueprint[]|Blueprint|string[]|Object)} req.body
 * @param {(Blueprint[]|Blueprint|string[])} [req.body.blueprints]
 * @param {string} [req.body.key=id] - Declares which property of a
 * Blueprint each element refers to. (It only makes sense when used
 * with a body that has an Array of strings in the req.body.blueprints
 * property)
 * @example
 * req.body.blueprints = [1,2], req.body.key=id
 * Each element of the input refers to a blueprint id
 * @example
 * req.body.blueprints = [BlueprintA,BlueprintB], req.body.key=name
 * Each element of the input refers to a blueprint name
 */
api.delete("/blueprints", (req, res) => {
  const blueprints = [req.body.blueprints || req.body].flat();
  const KEY = req.body.key || "id";
  const deleted = [];
  const notDeleted = [];

  for (let i = 0; i < blueprints.length; i++) {
    let sqliteResponse, key, blueprint, cause, status;
    blueprint = blueprints[i].name || blueprints[i].id || blueprints[i];
    key = blueprint.id ? "id" : blueprint.name ? "name" : KEY;
    try {
      sqliteResponse = db.deleteBlueprint(blueprint, key);
    } catch (err) {
      debug()(err);
      cause = err.message;
      status = err.code;
    }
    if (sqliteResponse?.changes) {
      deleted.push({
        message: `Successfully deleted blueprint: ${blueprint}`,
        status: 200,
        error: 0,
        data: blueprints[i],
      });
    } else {
      notDeleted.push({
        message: `Failed to delete blueprint: ${blueprint}`,
        status: status || 500,
        error: 1,
        errors: cause || "Internal Server Error",
        data: blueprints[i],
      });
    }
  }

  if (deleted.length) createBlueprintsPage();
  res.status(notDeleted.length ? 207 : 200).send([...deleted, notDeleted]);
});

export { api };
