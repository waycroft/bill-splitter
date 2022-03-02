import { TransactionBucketModel } from "~/models/TransactionSchema";
import { PoolModel } from "~/models/PoolSchema";
import invariant from "tiny-invariant";

import type { Transaction } from "~/models/TransactionSchema";

export async function insertTransaction(transaction: Transaction) {
  try {
    await pushToPoolsTransactions(transaction);
    return await addTransactionToBucket(transaction);
  } catch (error) {
    console.error(error);
    return { status: "error", message: JSON.stringify(error, null, "\t") };
  }
}

// semantically does this belong in the pools controller, or here?
async function pushToPoolsTransactions(transaction: Transaction) {
  let pool = await PoolModel.findOne({ _id: transaction.pool_id });
  invariant(pool, "Could not find pool to push transaction to");
  if (pool.transactions.length >= 25) {
    pool.transactions.shift();
  }
  pool.transactions.push(transaction);
  await pool.save();
}

async function addTransactionToBucket(transaction: Transaction) {
  let existingBucket = await TransactionBucketModel.findOne({
    pool_id: transaction.pool_id,
    transactions_size: { $lt: 50 },
  });
  if (existingBucket) {
    existingBucket.transactions.push(transaction);
    existingBucket.transactions_size += 1;
    existingBucket.end_date = transaction.transaction_date;
    return await existingBucket.save();
  } else {
    let newBucket = new TransactionBucketModel({
      pool_id: transaction.pool_id,
      start_date: transaction.transaction_date,
      end_date: transaction.transaction_date,
      transactions: [transaction],
      transactions_size: 1,
    });
    return await newBucket.save();
  }
}
