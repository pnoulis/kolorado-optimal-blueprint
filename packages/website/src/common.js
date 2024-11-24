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

export { saveBlob };
