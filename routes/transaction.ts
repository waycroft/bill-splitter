import * as express from 'express';
let router = express.Router();
import { Transaction } from '../src/models/Transaction';

/* GET home page. */
router.get('/', async function(req, res, next) {
  let transactions = await Transaction.find();

  res.send(transactions);
});

router.post('/', async function(req, res, next) {
  let $ = req.body;

  let transaction = new Transaction({
    payer: $.payer,
    payees: $.payees,
    date: $.date ? $.date : new Date(),
    memo: $.memo,
    amount: $.amount
  })
  await transaction.save();

  res.send(transaction);
});

module.exports = router;
