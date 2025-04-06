import { timing } from '../../timing.js';

function timeResponse(req, res, next) {
  timing.start(res.ctx.requestId);
  res.on('close', onResponseFinished);
  res.on('finish', onResponseFinished);
  res.on('error', onResponseFinished);
  return next();

  function onResponseFinished() {
    res.removeListener('close', onResponseFinished);
    res.removeListener('finish', onResponseFinished);
    res.removeListener('error', onResponseFinished);
    stopResponseTimer(res.ctx);
  }
}

function stopResponseTimer(ctx) {
  ctx.responseTime = timing.stop(ctx.requestId);
}

export { timeResponse };
