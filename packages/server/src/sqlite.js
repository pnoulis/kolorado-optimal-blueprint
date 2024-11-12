import { debug } from "common";
import sqlite from "better-sqlite3";

const _db = new sqlite(process.env.DB_URL);

const db = {
  createShapes: (() => {
    const one = _db.prepare(
      "INSERT INTO shape (name, state) VALUES (@name, @state)",
    );
    return function (shapes) {
      return one.run(shapes);
    };
  })(),
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
};

export { db };
