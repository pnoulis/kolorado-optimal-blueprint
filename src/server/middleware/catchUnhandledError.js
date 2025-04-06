function catchUnhandledError(err, req, res, next) {
  res.status(500).json(res.ctx.nok(err.message, err).serialize());
}

export { catchUnhandledError };
