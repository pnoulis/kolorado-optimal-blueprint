import { join } from 'node:path';

function notFound(req, res, next) {
  res.type("html").status(404).render(join(process.env.PUBLICDIR, "404"), {
    url: req.originalUrl,
  });
}

export { notFound };
