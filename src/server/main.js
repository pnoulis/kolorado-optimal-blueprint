import "./globals";
import express from "express";
import bodyParser from "body-parser";
// import { api } from "./api.js";
// import { health } from "./health.js";
import { logTransaction } from "./middleware/log.js";
import { transformStaticAssetUrl } from "./middleware/transformStaticAssetUrl.js";
import { notFoundError, internalServerError } from "./middleware/errors.js";
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
// app.use("/api", api);
// app.use("/health", health);
app.use(
  transformStaticAssetUrl,
  express.static(process.env.PUBLICDIR, {
    cacheControl: false,
    maxAge: "1y",
    etag: true,
    immutable: true,
    lastModified: false,
    setHeaders: (res) => {
      res.set("Cache-Control", "public, max-age=33155, immutable");
    },
  }),
);

app.all("*", notFoundError);
app.use(internalServerError);

debug()(`Created -> ${createHomePage()}`);
debug()(`Created -> ${createShapesPage()}`);
debug()(`Created -> ${createBlueprintsPage()}`);

app.listen(process.env.KOB_URL_PORT, () => {
  debug()(`${process.env.APP_ID} listening on port: ${process.env.KOB_URL_PORT}`);
});
