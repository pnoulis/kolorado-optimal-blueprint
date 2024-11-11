import { Router } from "express";

// const { blueprints } = await import(`${STATEDIR}/blueprints.js`);
// const { shapes } = await import(`${STATEDIR}/shapes.js`);

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

export { api };
