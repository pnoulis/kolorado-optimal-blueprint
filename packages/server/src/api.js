import { Router } from "express";
import { debug } from "common";

const api = Router();
api.get("/:className?/:id?", handler);
api.put("/:className/:id", handler);
api.post("/:className/:id?", handler);
api.delete("/:className/:id?", handler);

function handler(req, res) {
  debug("params")(req.params);
  res.send(req.params);
}

export { api };
