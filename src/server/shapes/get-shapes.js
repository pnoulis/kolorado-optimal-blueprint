import { db } from '../db.js';

const SQLGetShapes = db.prepare('SELECT * FROM shape');

async function getShapes(req, res) {
  const ctx = res.ctx;
  try {
    const shapes = SQLGetShapes.all();
    return res.status(200).json(ctx.ok('Retrieved shapes', shapes));
  } catch (err) {
    res.status(500).json(ctx.nok(err.message, err));
  }
};
export { getShapes };
