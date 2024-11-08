import { debug } from "../../common/index.js";

const loading = debug("loading...");

window.addEventListener("DOMContentLoaded", () => {
  loading("done!");

  const shapeEditBtns = document.querySelectorAll(".shape-edit");
  shapeEditBtns.forEach((btn) =>
    btn.addEventListener("click", handleEdit.bind(null, "shape")),
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
  btn.setAttribute("value", type);
  btn.classList.add(`${className}-${type}`);
  li.appendChild(btn);
  return li;
}

function handleEdit(className, e) {
  const toolbar = e.target.parentNode.parentNode;
  const cancelBtn = createBtn(className, "cancel");
  const submitBtn = createBtn(className, "submit");
  cancelBtn.addEventListener("click", handleCancelEdit.bind(null, className));
  submitBtn.addEventListener("click", handleSubmitEdit.bind(null, className));
  toolbar.replaceChildren(cancelBtn, submitBtn);
}
function handleCancelEdit(className, e) {
  const toolbar = e.target.parentNode.parentNode;
  const editBtn = createBtn(className, "edit");
  editBtn.addEventListener("click", handleEdit.bind(null, className));
  toolbar.replaceChildren(editBtn);
}

function handleSubmitEdit(className, e) {}
