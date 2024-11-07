function debug(title) {
  if (title) {
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    console.log(title);
  }
  return (msg) => {
    console.dir(msg, { depth: null });
  };
  if (title) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  }
}

export { debug };
