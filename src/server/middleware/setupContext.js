import { timing } from '../../timing.js';
import { Result } from "../../Result.js";

function setupContext(req, res, next) {
  res.ctx = new Result();
  res.ctx.requestId = `${timing.preciseTimestamp()}`;
  const endResponse = res.json;
  res.json = function(result) {
    endResponse.call(res, result.serialize());
  };
  return next();
}

export { setupContext };
