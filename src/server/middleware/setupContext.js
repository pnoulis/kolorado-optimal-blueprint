import { timing } from '../../timing.js';
import { Result } from "../Result2.js";

function setupContext(req, res, next) {
  res.ctx = new Result();
  res.ctx.requestId = `${timing.preciseTimestamp()}`;
  return next();
}

export { setupContext };
