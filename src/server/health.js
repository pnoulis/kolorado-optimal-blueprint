import { Router } from "express";
import * as Path from "node:path";
import { delay } from "/src/common/delay.js";

const health = new Router();

health.all("/", (req, res) => {
  res
    .status(req.body.status || req.query.status || 200)
    .send({ ...req.body, ...req.query });
});

health.all("/config", (req, res) => {
  debug("URL")(process.env.URL);
  debug("BASENAME")(process.env.BASENAME);
  res.status(200).send({
    url: process.env.URL,
    basename: process.env.BASENAME,
  });
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
