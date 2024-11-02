export function debug(title) {
  title && console.log(title);
  title && console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  return (msg) => {
    console.dir(msg, { depth: null });
    title && console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  };
}
