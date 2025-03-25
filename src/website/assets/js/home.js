// import { debug } from "../../common/index.js";
import { http } from "./http.js";

const queryShape = ".shape";
const queryShapeSelector = ".select-shape";
const queryShapeCount = ".input-count input";
const queryShapeRemove = ".remove-shape";

window.addEventListener("DOMContentLoaded", () => {
  const formOptimalBlueprints = document.querySelector(
    "#form-optimal-blueprints",
  );
  formOptimalBlueprints.addEventListener(
    "submit",
    handleOptimalBlueprintsSubmit,
  );

  const listOptimalBlueprints = document.querySelector(
    "#list-optimal-blueprint",
  );

  const addShapeBtn = document.querySelector("#add-shape");
  addShapeBtn.addEventListener("click", handleShapeAdd);

  const removeShapeBtn = document.querySelector(".remove-shape");
  removeShapeBtn.addEventListener("click", handleShapeRemove);

  const shapes = document.querySelector(".shapes");

  function handleShapeAdd(e) {
    e.stopPropagation();
    debug()("[EVENT:ADD:shape]");
    shapes.insertBefore(cloneShape(), e.currentTarget);
  }

  function handleShapeRemove(e) {
    e.stopPropagation();
    debug()("[EVENT:REMOVE:shape]");
    if (document.querySelectorAll(queryShape).length === 1) {
      alert("Cannot remove last shape");
      return;
    }
    shapes.removeChild(e.currentTarget.parentNode);
  }
  function handleOptimalBlueprintsSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    debug()("[EVENT:SUBMIT:optimalBlueprints]");
    const target_shapes = [];
    let shapeSelector, id, count;
    for (const shape of document.querySelectorAll(queryShape)) {
      shapeSelector = shape.querySelector(queryShapeSelector);
      id = parseInt(shapeSelector.options[shapeSelector.selectedIndex].value);
      count = parseInt(shape.querySelector(queryShapeCount).value);
      if (!(id && count)) continue;
      target_shapes.push({
        id,
        name: shapeSelector.options[shapeSelector.selectedIndex].text,
        count,
      });
    }
    http
      .post("api/optimal-blueprints", { json: target_shapes })
      .then((res) => res.json())
      .then(debug())
      .then((res) => {
        location.assign(res.optimalBlueprintLink);
      });
  }
  function cloneShape() {
    const clone = document.querySelector(queryShape).cloneNode(true);
    clone.querySelector(queryShapeSelector).selectedIndex = 0;
    clone.querySelector(queryShapeCount).value = 1;
    clone
      .querySelector(queryShapeRemove)
      .addEventListener("click", handleShapeRemove);
    return clone;
  }

  function getOptimalBlueprints() {
    
  }
});
