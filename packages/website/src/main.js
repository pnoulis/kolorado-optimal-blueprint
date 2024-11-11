import { debug } from "../../common/index.js";
import { http } from "./http.js";

const loading = debug("loading...");

window.addEventListener("DOMContentLoaded", () => {
  loading("done!");

  const shapeEditBtns = document.querySelectorAll(".shape-edit");
  for (let i = 0; i < shapeEditBtns?.length; i++) {
    shapeEditBtns[i].addEventListener("click", handleEdit.bind(null, "shape"));
  }

  const shapeAddBtn = document.querySelector(".shape-add");
  shapeAddBtn?.addEventListener(
    "click",
    handleSubmitCreate.bind(null, "shape"),
  );

  const blueprintEditBtns = document.querySelectorAll(".blueprint-edit");
  for (let i = 0; i < blueprintEditBtns?.length; i++) {
    blueprintEditBtns[i].addEventListener(
      "click",
      handleEdit.bind(null, "blueprint"),
    );
  }

  const blueprintAddBtn = document.querySelector(".blueprint-add");
  blueprintAddBtn?.addEventListener(
    "click",
    handleSubmitCreate.bind(null, "blueprint"),
  );
});

function handleShapeAdd() {}
function handleShapeEdit(e) {}
function handleShapeDelete() {}
function handleBlueprintAdd() {}
function handleBlueprintEdit() {}
function handleBlueprintDelete() {}

function createBtn(className, type) {
  const btn = document.createElement("button");
  const li = document.createElement("li");
  btn.textContent = type;
  btn.setAttribute("type", "button");
  btn.classList.add(`${className}-${type}`);
  li.appendChild(btn);
  return li;
}
function handleEdit(className, e) {
  debug()(`[EVENT:EDIT:${className}]`);
  const toolbar = e.target.parentNode.parentNode;
  const cancelBtn = createBtn(className, "cancel");
  const submitBtn = createBtn(className, "submit");
  cancelBtn.addEventListener("click", handleCancelEdit.bind(null, className));
  submitBtn.addEventListener("click", handleSubmitEdit.bind(null, className));
  toolbar.replaceChildren(cancelBtn, submitBtn);
}
function handleCancelEdit(className, e) {
  debug()(`[EVENT:CANCEL_EDIT:${className}]`);
  const toolbar = e.target.parentNode.parentNode;
  const editBtn = createBtn(className, "edit");
  editBtn.addEventListener("click", handleEdit.bind(null, className));
  toolbar.replaceChildren(editBtn);
}
function handleSubmitEdit(className, e) {
  debug()(`[EVENT:SUBMIT_EDIT:${className}]`);
}
function handleSubmitCreate(className, e) {
  debug()(`[EVENT:SUBMIT_CREATE:${className}]`);
  // http.get("health").then(debug());
  http
    .get("health/redirect", { query: { status: 404 } })
    .then(debug())
    .catch(debug());
  // http.put("health", { json: { name: "yolo" } }).then(debug());
}
