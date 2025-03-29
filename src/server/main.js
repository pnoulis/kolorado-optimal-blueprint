import { debug } from "../debug.js";
import express from "express";
import bodyParser from "body-parser";
import { router } from "./router.js";
// import { api } from "./api.js";
import { startResponse } from './middleware/startResponse.js';
import { logResponse } from "./middleware/logResponse.js";
import { finishResponse } from "./middleware/finishResponse.js";
// import { transformStaticAssetUrl } from "./middleware/transformStaticAssetUrl.js";
import { notFoundError, internalServerError } from "./middleware/errors.js";
// import {
//   createBlueprintsPage,
//   createHomePage,
//   createShapesPage,
// } from "./pages.js";

const app = new express();

app.set("view engine", "ejs");
app.use(startResponse);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logResponse);
app.use("/api", router);
app.use(finishResponse);
// app.use("/api", api);
// app.use(
//   transformStaticAssetUrl,
//   express.static(process.env.PUBLICDIR, {
//     cacheControl: false,
//     maxAge: "1y",
//     etag: true,
//     immutable: true,
//     lastModified: false,
//     setHeaders: (res) => {
//       res.set("Cache-Control", "public, max-age=33155, immutable");
//     },
//   }),
// );

// app.all("*", notFoundError);
app.use(internalServerError, finishResponse);

// debug()(`Created -> ${createHomePage()}`);
// debug()(`Created -> ${createShapesPage()}`);
// debug()(`Created -> ${createBlueprintsPage()}`);

app.listen(process.env.KOB_URL_PORT, () => {
  debug()(
    `${process.env.APP_ID} listening on port: ${process.env.KOB_URL_PORT}`,
  );
});
