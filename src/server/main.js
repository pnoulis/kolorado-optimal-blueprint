import { debug } from "../debug.js";
import express from "express";
import bodyParser from "body-parser";
import { router } from "./router.js";
// import { api } from "./api.js";
import { setupContext } from './middleware/setupContext.js';
import { timeResponse } from "./middleware/timeResponse.js";
import { logResponse } from "./middleware/logResponse.js";
import { notFound } from "./middleware/notFound.js";
import { catchUnhandledError } from "./middleware/catchUnhandledError.js";
// import { transformStaticAssetUrl } from "./middleware/transformStaticAssetUrl.js";
// import {
//   createBlueprintsPage,
//   createHomePage,
//   createShapesPage,
// } from "./pages.js";
const app = new express();

app.set("view engine", "ejs");

app.use(setupContext);
app.use(timeResponse);
app.use(logResponse);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/test', async (req, res) => {
  res.ctx.nok({
    foo: "bar",
  }, "succsfully created a resource");
  res.status(404).json(res.ctx.serialize());
})

app.use(notFound);
app.use(catchUnhandledError);

// app.use("/api", router);
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

// app.use(notFoundError);
// app.use((err, req, res, next) => {
//   console.log('error handler caught');
//   res.emit('error', err);
//   res.err = err;
//   res.status(err.code || 500).json({ error: "foobar" });
// })
// app.use(internalServerError);
// app.use(finishResponse);

// debug()(`Created -> ${createHomePage()}`);
// debug()(`Created -> ${createShapesPage()}`);
// debug()(`Created -> ${createBlueprintsPage()}`);

app.listen(process.env.KOB_URL_PORT, () => {
  debug()(
    `${process.env.APP_ID} listening on port: ${process.env.KOB_URL_PORT}`,
  );
});
