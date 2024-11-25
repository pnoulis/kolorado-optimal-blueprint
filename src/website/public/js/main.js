import { debug } from "../../common/index.js";
import { createDialog } from "./dialog.js";
import { http } from "./http.js";

const loading = debug("loading...");
const selection = [];
const page = document.location.pathname;
debug('page')(page);

window.addEventListener("DOMContentLoaded", () => {
  loading("done!");

  switch (page) {
    case "/":
      break;
    case "/blueprints":
      break;
    case "/shapes":
      break;
  }

  const shapes = document.querySelectorAll(".shape");
  for (let i = 0; i < shapes?.length; i++) {
    shapes[i].addEventListener("click", handleSelect.bind(null, "shape"));
  }
  const shapeEditBtns = document.querySelectorAll(".shape-edit");
  for (let i = 0; i < shapeEditBtns?.length; i++) {
    shapeEditBtns[i].addEventListener("click", handleEdit.bind(null, "shape"));
  }

  const shapeAddBtn = document.querySelector("#shape-add");
  shapeAddBtn?.addEventListener(
    "click",
    handleSubmitCreate.bind(null, "shape"),
  );
  const shapeDeleteBtn = document.querySelector("#shape-delete");
  shapeDeleteBtn?.addEventListener("click", handleDelete.bind(null, "shape"));

  const blueprints = document.querySelectorAll(".blueprint");
  for (let i = 0; i < blueprints?.length; i++) {
    blueprints[i].addEventListener(
      "click",
      handleSelect.bind(null, "blueprint"),
    );
  }
  const blueprintEditBtns = document.querySelectorAll(".blueprint-edit");
  for (let i = 0; i < blueprintEditBtns?.length; i++) {
    blueprintEditBtns[i].addEventListener(
      "click",
      handleEdit.bind(null, "blueprint"),
    );
  }
  const blueprintAddBtn = document.querySelector("#blueprint-add");
  blueprintAddBtn?.addEventListener(
    "click",
    handleSubmitCreate.bind(null, "blueprint"),
  );

  const exportBtns = document.querySelectorAll("button[value=export]");
  for (let i = 0; i < exportBtns?.length; i++) {
    exportBtns[i].addEventListener("click", handleExportExcel);
  }
});

function createBtn(className, type) {
  const btn = document.createElement("button");
  const li = document.createElement("li");
  btn.textContent = type;
  btn.setAttribute("type", "button");
  btn.classList.add(`${className}-${type}`);
  li.appendChild(btn);
  return li;
}
function handleSelect(className, e) {
  e.stopPropagation();
  debug()(`[EVENT:SELECT:${className}]`);
  const id = e.currentTarget.dataset.id;
  selection.push(id);
}
function handleEdit(className, e) {
  e.stopPropagation();
  debug()(`[EVENT:EDIT:${className}]`);
  const toolbar = e.target.parentNode.parentNode;
  const cancelBtn = createBtn(className, "cancel");
  const submitBtn = createBtn(className, "submit");
  cancelBtn.addEventListener("click", handleCancelEdit.bind(null, className));
  submitBtn.addEventListener("click", handleSubmitEdit.bind(null, className));
  toolbar.replaceChildren(cancelBtn, submitBtn);
}
function handleCancelEdit(className, e) {
  e.stopPropagation();
  debug()(`[EVENT:CANCEL_EDIT:${className}]`);
  e.stopPropagation();
  const toolbar = e.target.parentNode.parentNode;
  const editBtn = createBtn(className, "edit");
  editBtn.addEventListener("click", handleEdit.bind(null, className));
  toolbar.replaceChildren(editBtn);
}
function handleSubmitEdit(className, e) {
  e.stopPropagation();
  debug()(`[EVENT:SUBMIT_EDIT:${className}]`);
  const form = e.target.form;
  const formData = new window.FormData(form);
  http.put(`api/${className}/${form.dataset.id}`, { form: formData });
}
function handleSubmitCreate(className, e) {
  e.stopPropagation();
  debug()(`[EVENT:SUBMIT_CREATE:${className}]`);
  const form = e.target.form;
  const formData = new window.FormData(form);
  http.post(`api/${className}`, { form: formData });
}
function handleDelete(className, e) {
  e.stopPropagation();
  debug()(`[EVENT:DELETE:${className}]`);
  http.delete(`api/${className}/${selection.toString()}`);
}

function handleExportExcel(e) {
  e.stopPropagation();
  debug()(`[EVENT:EXPORT]`);
  let t_now = new Intl.DateTimeFormat(navigator.language, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h24",
  })
    .formatToParts()
    .reduce((car, cdr) => {
      car[cdr.type] = cdr.value;
      return car;
    }, {});
  t_now = `${t_now.year}${t_now.month}${t_now.day}-${t_now.hour}${t_now.minute}${t_now.second}`;
  http
    .get("api", {
      headers: {
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,*/*",
      },
    })
    .then((res) => res.blob())
    .then((blob) => saveBlob(blob, `boptimus-${t_now}`));
}

function saveBlob(blob, filename) {
  const urlObject = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = urlObject;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(urlObject);
}
