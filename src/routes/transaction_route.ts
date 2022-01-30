import * as express from 'express';
import { createTransaction } from '../controllers/transaction';
let router = express.Router();

router.post('/', async (req, res) => {
  try {
    res.send(await createTransaction(req.body.pool_id, req.body.transaction_data));
  } catch (error) {
      console.error(error);
      res.status(500).json({error: String(error)});
  }
})

module.exports = router;
