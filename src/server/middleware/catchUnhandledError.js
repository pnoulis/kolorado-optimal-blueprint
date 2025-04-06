function catchUnhandledError(err, req, res, next) {
  res.ctx.error(err);
  res.status(res.ctx.httpCode).json(res.ctx.serialize());
}

export { catchUnhandledError };
