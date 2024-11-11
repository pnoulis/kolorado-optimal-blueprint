function createDialog(name, markup) {
  const dialog = document.getElementsByTagName("dialog")[0];
  dialog.setAttribute("id", name);
  dialog.replaceChildren(markup);
  return {
    showModal: () => dialog.showModal(),
    show: () => dialog.show(),
    close: () => dialog.close(),
  };
}

export { createDialog };
