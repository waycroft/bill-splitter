import * as express from 'express';
import { upsertTransaction } from '../controllers/transaction';
let router = express.Router();

router.post('/', async (req: any, res: any) => {
  try {
    res.send(await upsertTransaction(req.body));
  } catch (error) {
      console.error(error);
      res.status(500).json({error: String(error)});
  }
})

module.exports = router;
