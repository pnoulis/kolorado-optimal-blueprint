import { debug } from "common";
import express from "express";
import * as Path from "node:path";
import * as URL from "node:url";
import { api } from "./api.js";

const __dirname = Path.dirname(URL.fileURLToPath(import.meta.url));
const PUBLICDIR = `${process.env.PUBLICDIR}`;

debug("__dirname")(__dirname);
debug("PUBLICDIR")(PUBLICDIR);

const app = new express();

app.use("/blueprints", (req, res) => {
  debug("blueprints->")(Path.join(PUBLICDIR, "blueprints.html"));
  res.sendFile(Path.join(PUBLICDIR, "blueprints.html"));
});
app.use("/shapes", (req, res) => {
  debug("shapes->")(Path.join(PUBLICDIR, "shapes.html"));
  res.sendFile(Path.join(PUBLICDIR, "shapes.html"));
});
app.use(express.static(PUBLICDIR));
app.use("/api", api);
app.listen(process.env.PORT, () => {
  debug(`${process.env.PKG_ID} listening on port: ${process.env.PORT}`);
});
