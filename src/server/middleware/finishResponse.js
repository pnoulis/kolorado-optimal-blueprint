import { timing } from '../../timing.js';

function finishResponse(req, res, next) {
  const ctx = res.locals.ctx;
  ctx.responseTime = timing.stop(ctx.requestId);
  res.status(ctx._status).json(ctx.flush()).send();
}

export { finishResponse };
