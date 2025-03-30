import { extname } from "node:path";
import { Buffer } from "node:buffer";
import { log } from "../../log.js";

function logResponse(req, res, next) {
  let oldWrite = res.write,
    oldEnd = res.end,
    body;

  const chunks = [];
  const ctx = res.locals.ctx;

  res.write = function (chunk) {
    chunks.push(Buffer.from(chunk));

    oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) chunks.push(Buffer.from(chunk));

    body = Buffer.concat(chunks).toString("utf8");
    oldEnd.apply(res, arguments);
  };

  const url = req.path;
  log.info({
    method: req.method,
    url,
    requestId: ctx.requestId,
    msg: `${req.method} ${url}`
  });
  log.trace({
    requestId: ctx.requestId,
    headers: req.headers,
    data: {
      body: req.body,
      query: req.query,
    },
  });
  res.on("finish", () => {
    log[ctx._ok ? "info" : "error"]({
      requestId: ctx.requestId,
      responseTime: ctx.responseTime,
      httpCode: res.statusCode,
      httpMsg: res.statusMessage,
      msg: ctx.msg,
    });

    log.trace({
      requestId: ctx.requestId,
      headers: res.getHeaders(),
      data: ctx,
    });
  });
  return next();
}

export { logResponse };
