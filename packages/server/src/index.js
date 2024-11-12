import "./globals.js";
import express from "express";
import bodyParser from "body-parser";
import { api } from "./api.js";
import { health } from "./health.js";
import { logTransaction } from "./middleware/log.js";
import { notFoundError, internalServerError } from "./middleware/errors.js";
import { transformStaticAssetUrl } from "./middleware/transformStaticAssetUrl.js";
import { createBlueprintsPage, createShapesPage } from "./pages.js";

const app = new express();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logTransaction);
app.use("/api", api);
app.use("/health", health);
app.use(
  transformStaticAssetUrl,
  express.static(process.env.PUBLICDIR, { maxAge: "1y" }),
);

app.all("*", notFoundError);
app.use(internalServerError);

app.listen(process.env.PORT, () => {
  try {
    debug()(`${process.env.PKG_ID} listening on port: ${process.env.PORT}`);
    let page;
    page = createShapesPage();
    debug()(`Created -> ${page}`);
    // page = createBlueprintsPage();
    // debug()(`Created -> ${page}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
