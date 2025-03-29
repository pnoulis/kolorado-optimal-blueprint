import { timing } from '../../timing.js';
import { Result } from "../Result.js";

function startResponse(req, res, next) {
  res.locals.ctx = new Result();
  const ctx = res.locals.ctx;
  ctx.requestId = `${timing.preciseTimestamp()}`;
  timing.start(ctx.requestId);
  return next();
}

export { startResponse };
