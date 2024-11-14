import { debug } from "common";
import sqlite from "better-sqlite3";

/**
 * Shape State
 * @typedef {number} ShapeState - active(0), deleted(1)
 */

/**
 * Shape
 * @typedef {Object} Shape
 * @property {string} id
 * @property {string} name
 * @property {ShapeState} state
 */

/**
 * Blueprint State
 * @typedef {number} BlueprintState - active(0), deleted(1), invalid(2)
 */

/**
 * @typedef {Object} BlueprintShape
 * @extends Shape
 * @property {number} count
 */

/**
 * Blueprint
 * @typedef {Object} Blueprint
 * @property {string} id
 * @property {string} name
 * @property {BlueprintState} state
 * @property {BlueprintShape[]} shapes
 */

const _db = new sqlite(process.env.DB_URL);
const db = {
  /**
   * @returns {Shape}
   */
  createShapes: (() => {
    const one = _db.prepare(
      "INSERT INTO shape (name, state) VALUES (@name, @state)",
    );
    return function (shapes) {
      return one.run(shapes);
    };
  })(),
  /**
   * @returns {Shape[]|Shape}
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
          ? oneId.get(shapes)
          : oneName.get(shapes);
    };
  })(),
  updateShapes: (() => {
    const oneId = _db.prepare(
      "UPDATE shape SET name=@name, state=@state WHERE id=@id",
    );
    return function (shapes) {
      return oneId.run(shapes);
    };
  })(),

  /**
   * @returns {Blueprint}
   */
  createBlueprints: (() => {
    const one = _db.prepare(
      "INSERT INTO blueprint (name, state) VALUES (@name, @state)",
    );
    return function (blueprints) {
      return one.run(blueprints);
    };
  })(),

  /**
   * @returns {(Blueprint[]|Blueprint)}
   */
  getBlueprints: (() => {
    const all = _db.prepare(`
SELECT blueprint.id, blueprint.name, blueprint.state,
shape.id AS shape_id, shape.name AS shape_name, shape.state as shape_state,
blueprint_shape.shape_count
FROM blueprint
JOIN blueprint_shape ON blueprint.id=blueprint_shape.blueprint_id
JOIN shape on blueprint_shape.shape_id=shape.id`);
    // const oneId = _db.prepare("SELECT * FROM blueprint WHERE id=?");
    // const oneName = _db.prepare("SELECT * FROM blueprint WHERE name=?");
    // const some = (blueprints, key) => {
    //   let parameters = "";
    //   for (let i = 0; i < blueprints.length; i++) {
    //     parameters += `,'${blueprints[i]}'`;
    //   }
    //   return _db.prepare(
    //     `SELECT * FROM blueprint WHERE ${key} IN (${parameters.slice(1)})`,
    //   );
    // };
    return function (blueprints, key) {
      let blueprints_in;
      const blueprints_out = {};

      blueprints_in = all.all();
      // return all.all();

      for (let i = 0; i < blueprints_in.length; i++) {
        blueprints_out[blueprints_in[i].id] ||= {
          id: blueprints_in[i].id,
          name: blueprints_in[i].name,
          state: blueprints_in[i].state,
          shapes: [],
        };
        blueprints_out[blueprints_in[i].id].shapes.push({
          id: blueprints_in[i].shape_id,
          name: blueprints_in[i].shape_name,
          state: blueprints_in[i].shape_state,
          count: blueprints_in[i].shape_count,
        });
      }
      return Object.values(blueprints_out);
      // blueprints = all.all();
      // if (!blueprints) return all.all();
      // key ||= "id";
      // return Array.isArray(blueprints)
      //   ? some(blueprints, key).all()
      //   : key === "id"
      //     ? oneId.get(blueprints)
      //     : oneName.get(blueprints);
    };
  })(),
};

export { db };
