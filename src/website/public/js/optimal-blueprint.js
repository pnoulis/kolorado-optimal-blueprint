import { debug } from "common";
import { http } from "./http.js";
import { saveBlob } from "./common.js";

window.addEventListener("DOMContentLoaded", () => {
  const btnOptimalBlueprintDownload = document.querySelector(
    "#btn-optimal-blueprint-download",
  );
  btnOptimalBlueprintDownload.addEventListener(
    "click",
    handleClickBtnOptimalBlueprintDownload,
  );
});

function handleClickBtnOptimalBlueprintDownload(e) {
  e.stopPropagation();
  const optimalBlueprintId = e.currentTarget.value;
  const filename = `optimal-blueprint-${optimalBlueprintId}`;
  debug()(`[EVENT:DOWNLOAD:${filename}]`);
  http
    .get(`api/optimal-blueprint/${optimalBlueprintId}`, {
      headers: {
        Accept: "text/plain",
      },
    })
    .then((res) => res.blob())
    .then((blob) => saveBlob(blob, filename));
}
