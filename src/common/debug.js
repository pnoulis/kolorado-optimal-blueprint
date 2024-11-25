function debug(title) {
  if (title) {
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    console.log(title);
  }
  return (msg) => {
    typeof msg === "object"
      ? console.dir(msg, { depth: null })
      : console.log(msg);
    if (title) {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    }
    return msg;
  };
}

export { debug };
