import "./globals.js";
import express from "express";
import bodyParser from "body-parser";
import { api } from "./api.js";
import { health } from "./health.js";
import { logTransaction } from "./middleware/log.js";
import { notFoundError, internalServerError } from "./middleware/errors.js";
import { transformStaticAssetUrl } from "./middleware/transformStaticAssetUrl.js";
import {
  createBlueprintsPage,
  createHomePage,
  createShapesPage,
} from "./pages.js";

const app = new express();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logTransaction);
app.use(
  "/api",
  (req, res, next) => {
    res.set("cache-control", "no-store");
    res.set("etag", "");
    return next();
  },
  api,
);
app.use("/health", health);
app.use(
  transformStaticAssetUrl,
  express.static(process.env.PUBLICDIR, { maxAge: "1y" }),
);

app.all("*", notFoundError);
app.use(internalServerError);

debug()(`Created -> ${createHomePage()}`);
debug()(`Created -> ${createShapesPage()}`);
debug()(`Created -> ${createBlueprintsPage()}`);

app.listen(process.env.PORT, () => {
  debug()(`${process.env.PKG_ID} listening on port: ${process.env.PORT}`);
});
