import { TransactionBucketModel } from "~/models/TransactionSchema";
import { PoolModel } from "~/models/PoolSchema";

import type {
  Transaction,
  TransactionRequest,
} from "~/models/TransactionSchema";
import invariant from "tiny-invariant";

export async function upsertTransaction(
  transactionRequest: TransactionRequest
) {
  try {
    await pushToPoolsTransactions(
      transactionRequest.pool_id,
      transactionRequest.transaction
    );
    return await addTransactionToBucket(
      transactionRequest.pool_id,
      transactionRequest.transaction
    );
  } catch (error) {
    console.error(error);
    return { status: "error", message: JSON.stringify(error, null, '\t') }};
}

// semantically does this belong in the pools controller, or here?
async function pushToPoolsTransactions(
  poolId: string,
  transaction: Transaction
) {
  let pool = await PoolModel.findOne({ _id: poolId });
  invariant(pool, "Could not find pool to push transaction to");
  if (pool.transactions.length >= 25) {
    pool.transactions.shift();
  }
  pool.transactions.push(transaction);
  await pool.save();
}

async function addTransactionToBucket(
  pool_id: string,
  transaction: Transaction
) {
  let existingBucket = await TransactionBucketModel.findOne({
    pool_id: pool_id,
    transactions_size: { $lt: 50 },
  });
  if (existingBucket) {
    existingBucket.transactions.push(transaction);
    existingBucket.transactions_size += 1;
    existingBucket.end_date = transaction.transaction_date;
    return await existingBucket.save();
  } else {
    let newBucket = new TransactionBucketModel({
      pool_id: pool_id,
      start_date: transaction.transaction_date,
      end_date: transaction.transaction_date,
      transactions: [transaction],
      transactions_size: 1,
    });
    return await newBucket.save();
  }
}
