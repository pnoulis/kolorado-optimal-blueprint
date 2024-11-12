import { extname } from "node:path";

function transformStaticAssetUrl(req, res, next) {
  if (req.path === "/") {
    req.url += "index.html";
  } else if (!extname(req.url)) {
    req.url += ".html";
  }
  next();
}

export { transformStaticAssetUrl };
