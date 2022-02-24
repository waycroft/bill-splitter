import { TransactionBucketModel } from "~/models/TransactionSchema";
import { PoolModel } from "~/models/PoolSchema";

import type {
  TransactionBucket,
  Transaction,
  TransactionRequest,
} from "~/models/TransactionSchema";

export async function upsertTransaction(
  transactionRequest: TransactionRequest
) {
  await pushToPoolsTransactions(
    transactionRequest.pool_id,
    transactionRequest.transaction
  );
  return await addTransactionToBucket(
    transactionRequest.pool_id,
    transactionRequest.transaction
  );
}

// semantically does this belong in the pools controller, or here?
async function pushToPoolsTransactions(
  poolId: string,
  transaction: Transaction
) {
  let pool = await PoolModel.findOne({ _id: poolId });
  if (pool && pool.transactions.length >= 25) {
    pool.transactions.shift();
  }
  if (pool) {
    pool.transactions.push(transaction);
    await pool.save();
  } else {
    throw "Couldn't find pool";
  }
}

async function addTransactionToBucket(requestBody: TransactionRequest) {
  let existingBucket = await TransactionBucketModel.findOne({
    pool_id: requestBody.pool_id,
    transactions_size: { $lt: 50 },
  });
  if (existingBucket) {
    existingBucket.transactions.push(requestBody.transaction);
    existingBucket.transactions_size += 1;
    existingBucket.end_date = requestBody.transaction.date;
    return await existingBucket.save();
  } else {
    let newBucket = new TransactionBucketModel({
      pool_id: requestBody.pool_id,
      start_date: requestBody.transaction.date,
      end_date: requestBody.transaction.date,
      transactions: [requestBody.transaction],
      transactions_size: 1,
    });
    return await newBucket.save();
  }
}
