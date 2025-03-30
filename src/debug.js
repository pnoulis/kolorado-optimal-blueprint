import { log } from './log.js';


function debug(title) {
  if (title) {
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    console.log(title);
  }
  return (msg) => {
    log.debug(msg);
    if (title) {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    }
    return msg;
  };
}

export { debug };
