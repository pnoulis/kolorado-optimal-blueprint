import { Router } from "express";
import * as Path from "node:path";
import { delay } from "common";

const health = new Router();

health.all("/", (req, res) => {
  res
    .status(req.body.status || req.query.status || 200)
    .send({ ...req.body, ...req.query });
});
health.all("/fail", (req, res) => {
  res
    .status(req.body.status || req.query.status || 500)
    .send({ ...req.body, ...req.qeury });
});
health.all("/timeout", (req, res) => {
  return delay(req.body.delay || req.query.delay || 30000).then(() =>
    res.status(408).send(),
  );
});

export { health };
