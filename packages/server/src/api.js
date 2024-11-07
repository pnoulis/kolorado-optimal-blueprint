import { Router } from "express";
import { debug } from "common";

const STATEDIR = `${process.env.STATEDIR}`;
debug("STATEDIR")(STATEDIR);
const { blueprints } = await import(`${STATEDIR}/blueprints.js`);
const { shapes } = await import(`${STATEDIR}/shapes.js`);
debug("blueprints")(blueprints);
debug("shapes")(shapes);

const api = Router();
api.get("/optimal-blueprint", (req, res) => {});
api.get("/class/:className?/:id?", (req, res) => {
  const { className, id } = req.params;
});
api.put("/class/:className/:id", (req, res) => {
  const { className, id } = req.params;
});
api.post("/class/:className/:id?", (req, res) => {
  const { className, id } = req.params;
});
api.delete("/class/:className/:id?", (req, res) => {
  const { className, id } = req.params;
});

function handler(req, res) {
  debug("params")(req.params);
  res.send(req.params);
}

export { api };
