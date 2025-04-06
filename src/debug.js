function debug(title) {
  if (title) {
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    console.log(title);
  }
  return (msg) => {
    console.log(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    if (title) {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    }
    return msg;
  };
}

export { debug };
