import { log } from "../../log.js";

function logResponse(req, res, next) {
  res.on('close', onResponseFinished);
  res.on('finish', onResponseFinished);
  res.on('error', onResponseFinished);
  return next();

  function onResponseFinished() {
    res.removeListener('close', onResponseFinished);
    res.removeListener('finish', onResponseFinished);
    res.removeListener('error', onResponseFinished);

    if (res.statusCode < 300) logSuccess(req, res);
    else logError(req, res);
  }
}

function logSuccess(req, res) {
  log.info('what');
  log.info({
    req: {
      id: res.ctx.requestId,
      path: req.path,
      method: req.method,
      headers: req.headers,
      params: req.params,
      query: req.query,
      body: req.body
    },
    res: {
      time: res.ctx.responseTime,
      httpCode: res.statusCode,
      httpMsg: res.statusMessage,
      headers: res.getHeaders(),
      body: res.ctx.serialize()
    }
  });
};

function logError(req, res) {
  log.error({
    req: {
      id: res.ctx.requestId,
      path: req.path,
      method: req.method,
      headers: req.headers,
      params: req.params,
      query: req.query,
      body: req.body
    },
    res: {
      time: res.ctx.responseTime,
      httpCode: res.statusCode,
      httpMsg: res.statusMessage,
      headers: res.getHeaders(),
      body: res.ctx.serialize()
    }
  });
};

export { logResponse };
