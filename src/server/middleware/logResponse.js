import prettyJson from "prettyjson";
import { extname } from "node:path";
import { Buffer } from "node:buffer";

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
  console.log(
    `[${ctx.requestId}] ${req.method} ${url}
HEADERS<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
${prettyJson.render(req.headers)}
META<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
${prettyJson.render({
  requestId: ctx.requestId
})}
QUERY<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
${req.query ? prettyJson.render(req.query) : "{}"}
BODY<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
${req.body ? prettyJson.render(req.body) : "{}"}`,
  );
  res.on("finish", () => {
    console.log(res.locals.ctx);
    const ctx = res.locals.ctx;
    const type = res.get("Content-Type");
    const txt = /\/text|\/json/.test(type);
    console.log(`[${ctx.requestId}] ${req.method} ${res.statusCode} ${url}
HEADERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
${prettyJson.render(res.getHeaders())}
META>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
${prettyJson.render({
responseTime: ctx.responseTime,
})}
BODY>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
${txt ? prettyJson.render(JSON.parse(body)) : type}
`);
  });
  return next();
}

export { logResponse };
