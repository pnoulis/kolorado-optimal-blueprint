import { debug } from "common";
import sqlite from "better-sqlite3";

const _db = new sqlite("boptimus.db");

const db = {
  createShape: (() => {
    const sql = _db.prepare(`INSERT INTO shapes
(name, state)
VALUES
(@name, @state)`);
    return function (shape) {
      return sql.run(shape);
    };
  })(),
  getShapes: (() => {
    const all = _db.prepare(`SELECT * FROM shapes`);
    const some = (shapes, key) =>
      _db
        .prepare(
          `SELECT * FROM shapes
WHERE ${key} IN (${shapes.map((_) => `'${_}'`).join(",")})`,
        )
        .all();

    const one = (shape, key) =>
      _db
        .prepare(
          `SELECT * FROM shapes s
WHERE ${key}='${shape}'`,
        )
        .get();

    return function (shapes, key) {
      return !shapes
        ? all.all()
        : Array.isArray(shapes)
          ? some(shapes, key || "id")
          : one(shapes, key || "id");
    };
  })(),
};

// db.createShape({ name: "two", state: 0 });
const shapes = db.getShapes();
debug()(shapes);

// const db = (() => {
//   const _db = new sqlite("boptimus.db");

//   _db.exec(`
// CREATE TABLE IF NOT EXISTS shapes (
// id INTEGER PRIMARY KEY,
// name TEXT NOT NULL,
// state INTEGER NOT NULL
// )`);

//   return {
//     createShape: _db.prepare(
//       `INSERT INTO shapes
// (name, state)
// VALUES
// (@name, @state)`,
//     ),
//     getShapes: _db.prepare(`SELECT * FROM shapes`)
//   };
// })();

// // const e = db.createShape.run({ name: "one", state: 1 });
// debug()(db.getShapes.all());
// // const createShape = db.prepare(`INSERT INTO shapes
// // (name, state)
// // VALUES
// // (@name, @state)`);

// // debug()(e);
