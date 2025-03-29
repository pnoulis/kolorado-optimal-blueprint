import { join } from "node:path";
// import { Kerror } from "/src/common/Kerror.js";
import { Result } from '../Result.js';

function notFoundError(req, res) {
  res.type("html").status(404).render(join(process.env.PUBLICDIR, "404"), {
    url: req.originalUrl,
  });
}

function internalServerError(err, req, res, next) {
  const ctx = res.locals.ctx;
  ctx.status(500).nok(err.message, err);
  return next();
}

export { notFoundError, internalServerError };
