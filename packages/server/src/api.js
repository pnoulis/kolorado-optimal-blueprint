import { Router } from "express";

// const { blueprints } = await import(`${STATEDIR}/blueprints.js`);
// const { shapes } = await import(`${STATEDIR}/shapes.js`);

const api = Router();

api.get("/optimal-blueprint", (req, res) => {});
api.get("/:className?/:id?", (req, res) => {
  const { className, id } = req.params;
});
api.post("/:className", (req, res) => {
  const { className, id } = req.params;
  res.send(req.body);
});
api.put("/:className/:id", (req, res) => {
  const { className, id } = req.params;
});
api.delete("/:className/:ids", (req, res) => {
  const { className, ids } = req.params;
});

export { api };
