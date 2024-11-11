import prettyJson from "prettyjson";
import { extname } from "node:path";
import { Buffer } from "node:buffer";

function logTransaction(req, res, next) {
  const timestamp = Date.now();
  let oldWrite = res.write,
    oldEnd = res.end,
    body;

  const chunks = [];

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
    `[${timestamp}] ${req.method} ${url}
HEADERS<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
${prettyJson.render(req.headers)}
QUERY<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
${req.query ? prettyJson.render(req.query) : "{}"}
BODY<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
${req.body ? prettyJson.render(req.body) : "{}"}`,
  );
  res.on("finish", () => {
    const type = res.get("Content-Type");
    const txt = /\/text|\/json/.test(type);
    console.log(`[${timestamp}] ${res.statusCode} ${url}
HEADERS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
${prettyJson.render(res.getHeaders())}
BODY>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
${txt ? prettyJson.render(body) : type}
`);
  });
  return next();
}

export { logTransaction };
