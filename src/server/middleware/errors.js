import { join } from "node:path";
import { Kerror } from "/src/common/Kerror.js";

function notFoundError(req, res) {
  res.type("html").status(404).render(join(PUBLICDIR, "404"), {
    url: req.originalUrl,
  });
}

function internalServerError(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).send({
    message: err.message,
    error: 1,
    errors: err.cause?.message || err.cause || err.message,
  });
}

export { notFoundError, internalServerError };
