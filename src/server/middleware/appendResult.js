import { Result } from '../Result.js';

function appendResult(req, res, next) {
  res.locals.ctx = { result: new Result() };
  next();
}

export { appendResult };
