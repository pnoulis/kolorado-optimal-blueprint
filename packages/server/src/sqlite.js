import { Kerror } from "common";
import sqlite from "better-sqlite3";

/**
 * Shape
 * @typedef {Object} Shape
 * @property {string} id
 * @property {string} name
 */

/**
 * BlueprintShape
 * @typedef {Object} BlueprintShape
 * @extends Shape
 * @property {number} count
 */

/**
 * Blueprint
 * @typedef {Object} Blueprint
 * @property {string} id
 * @property {string} name
 * @property {BlueprintShape[]} shapes
 */

/**
 * SqliteResponse
 * @typedef {Object} SqliteResponse
 * @property {number} changes
 * @property {number} lastInsertRowid
 */

const _db = new sqlite(process.env.DB_URL);
const db = {
  /**
   * Create shape
   * @param {Shape} shape
   * @returns {SqliteResponse}
   */
  createShape: (() => {
    const one = _db.prepare("INSERT INTO shape (name) VALUES (@name)");
    return function (shape) {
      return one.run(shape);
    };
  })(),
  /**
   * Delete shape
   * @param {string} shape
   * @param {string} [key=id]
   * @returns {SqliteResponse}
   */
  deleteShape: (() => {
    const oneId = _db.prepare("DELETE FROM shape WHERE id=?");
    const oneName = _db.prepare("DELETE FROM shape WHERE name=?");
    return function (shape, key) {
      let sqliteResponse;
      key ||= "id";
      sqliteResponse = key === "id" ? oneId.run(shape) : oneName.run(shape);
    };
  })(),

  /**
   * Create blueprint
   * @param {Blueprint} blueprint
   * @returns {SqliteResponse}
   */
  createBlueprint: (() => {
    const one = _db.prepare("INSERT INTO blueprint (name) VALUES (@name)");
    return function (blueprint) {
      return one.run(blueprint);
    };
  })(),

  /**
   * Delete blueprint
   * @param {Blueprint} blueprint
   * @param {string} [key=id]
   * @returns {SqliteResponse}
   */
  deleteBlueprint: (() => {
    const oneId = _db.prepare("DELETE FROM blueprint WHERE id=?");
    const oneName = _db.prepare("DELETE FROM blueprint WHERE name=?");
    return function (blueprint, key) {
      key ||= "id";
      return key === "id" ? oneId.run(blueprint) : oneName.run(blueprint);
    };
  })(),

  /**
   * Create blueprintShape
   * @param {BlueprintShape} blueprintShape
   * @returns {SqliteResponse}
   */
  createBlueprintShape: (() => {
    const one =
      _db.prepare(`INSERT INTO blueprint_shape (blueprint_id, shape_id, count)
VALUES (@id, @shape_id, @count)`);

    return function (blueprintShape) {
      return one.run(blueprintShape);
    };
  })(),

  /**
   * Get shapes
   * @param {string[]} shapes
   * @param {string} [key=id]
   * @returns {Shape[]}
   */
  getShapes: (() => {
    const all = _db.prepare("SELECT * FROM shape");
    const oneId = _db.prepare("SELECT * FROM shape WHERE id=?");
    const oneName = _db.prepare("SELECT * FROM shape WHERE name=?");
    const some = (shapes, key) => {
      let parameters = "";
      for (let i = 0; i < shapes.length; i++) {
        parameters += `,'${shapes[i]}'`;
      }
      return _db.prepare(
        `SELECT * FROM shape WHERE ${key} IN (${parameters.slice(1)})`,
      );
    };
    return function (shapes, key) {
      if (!shapes) return all.all();
      key ||= "id";
      return Array.isArray(shapes)
        ? some(shapes, key).all()
        : key === "id"
          ? oneId.all(shapes)
          : oneName.all(shapes);
    };
  })(),

  /**
   * Get blueprints
   * @param {string[]} blueprints
   * @param {string} [key=id]
   * @returns {Blueprint[]}
   */
  getBlueprints: (() => {
    const all = _db.prepare(`
SELECT blueprint.id, blueprint.name,
shape.id AS shape_id, shape.name AS shape_name, blueprint_shape.count
FROM blueprint
JOIN blueprint_shape ON blueprint.id=blueprint_shape.blueprint_id
JOIN shape ON blueprint_shape.shape_id=shape.id`);
    const oneId = _db.prepare(`
SELECT blueprint.id, blueprint.name,
shape.id AS shape_id, shape.name AS shape_name, blueprint_shape.count
FROM blueprint
JOIN blueprint_shape ON blueprint.id=blueprint_shape.blueprint_id
JOIN shape ON blueprint_shape.shape_id=shape.id
WHERE blueprint.id=?
`);
    const oneName = _db.prepare(`
SELECT blueprint.id, blueprint.name,
shape.id AS shape_id, shape.name AS shape_name, blueprint_shape.count
FROM blueprint
JOIN blueprint_shape ON blueprint.id=blueprint_shape.blueprint_id
JOIN shape ON blueprint_shape.shape_id=shape.id
WHERE blueprint.name=?
`);
    const some = (blueprints, key) => {
      let parameters = "";
      for (let i = 0; i < blueprints.length; i++) {
        parameters += `,'${blueprints[i]}'`;
      }
      return _db.prepare(`
SELECT blueprint.id, blueprint.name,
shape.id AS shape_id, shape.name AS shape_name, blueprint_shape.count
FROM blueprint
JOIN blueprint_shape ON blueprint.id=blueprint_shape.blueprint_id
JOIN shape ON blueprint_shape.shape_id=shape.id
WHERE blueprint.${key} IN (${parameters.slice(1)})
`);
    };
    return function (blueprints, key) {
      let blueprints_in;
      const blueprints_out = {};

      key ||= "id";
      if (!blueprints) blueprints_in = all.all();
      else if (Array.isArray(blueprints))
        blueprints_in = some(blueprints, key).all();
      else if (key === "name") blueprints_in = oneId.all(blueprints);
      else blueprints_in = oneName.all(blueprints);

      for (let i = 0; i < blueprints_in.length; i++) {
        blueprints_out[blueprints_in[i].id] ||= {
          id: blueprints_in[i].id,
          name: blueprints_in[i].name,
          shapes: [],
        };
        blueprints_out[blueprints_in[i].id].shapes.push({
          id: blueprints_in[i].shape_id,
          name: blueprints_in[i].shape_name,
          count: blueprints_in[i].count,
        });
      }
      return Object.values(blueprints_out);
    };
  })(),

  /**
   * Get blueprint shapes
   * @param {string[]} blueprintShapes
   * @param {string} [key=blueprint_id]
   * @returns {BlueprintShape[]}
   */
  getBlueprintShapes: (() => {
    const all = _db.prepare("SELECT * from blueprint_shape");
    const oneBlueprintId = _db.prepare(
      "SELECT * FROM blueprint_shape WHERE blueprint_id=?",
    );
    const oneShapeId = _db.prepare(
      "SELECT * FROM blueprint_shape WHERE shape_id=?",
    );
    const some = (blueprintShapes, key) => {
      let parameters = "";
      for (let i = 0; i < blueprintShapes.length; i++) {
        parameters += `,'${blueprintShapes[i]}'`;
      }
      return _db.prepare(
        `SELECT * FROM blueprint_shape WHERE ${key} IN (${parameters.slice(1)})`,
      );
    };
    return function (blueprintShapes, key) {
      if (!blueprintShapes) return all.all();
      key ||= "blueprint_id";
      return Array.isArray(blueprintShapes)
        ? some(blueprintShapes, key).all()
        : key === "blueprint_id"
          ? oneBlueprintId.all(blueprintShapes)
          : oneShapeId.all(blueprintShapes);
    };
  })(),
};

export { db };
