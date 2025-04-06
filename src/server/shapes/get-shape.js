import { db } from '../db.js';

const SQLGetShape = db.prepare('SELECT * FROM shape WHERE id=?');

async function getShape(req, res) {
  const ctx = res.ctx;
  try {
    const shape = SQLGetShape.get(req.params.id);
    if (!shape) {
      return res.status(404).json(ctx.nok('Not found', {
        id: req.params.id
      }));
    }
    res.status(200).json(ctx.ok('Retrieved shape', shape));
  } catch (err) {
    res.status(500).json(ctx.nok(err.message, err));
  }
};
export { getShape };
