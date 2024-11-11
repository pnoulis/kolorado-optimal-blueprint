import { join } from "node:path";

function notFoundError(req, res) {
  res.type("html").status(404).render(join(PUBLICDIR, "404"), {
    url: req.originalUrl,
  });
}

function internalServerError(err, req, res, next) {
  console.error(err);
  res.type("html").status(500).render(join(PUBLICDIR, "500"), {
    err,
  });
}

export { notFoundError, internalServerError };
