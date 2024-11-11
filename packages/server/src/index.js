import "./globals.js";
import express from "express";
import { join } from "node:path";
import bodyParser from "body-parser";
import { api } from "./api.js";
import { health } from "./health.js";
import { logTransaction } from "./middleware/log.js";
import { notFoundError, internalServerError } from "./middleware/errors.js";

const app = new express();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logTransaction);
app.use("/api", api);
app.use("/health", health);

app.use("/blueprints", (req, res) => {
  res.sendFile(join(PUBLICDIR, "blueprints.html"));
});
app.use("/shapes", (req, res) => {
  res.sendFile(join(PUBLICDIR, "shapes.html"));
});

app.use(express.static(PUBLICDIR));

app.all("*", notFoundError);
app.use(internalServerError);

app.listen(process.env.PORT, () => {
  debug(`${process.env.PKG_ID} listening on port: ${process.env.PORT}`);
});
