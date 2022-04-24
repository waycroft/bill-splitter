// todo: architecture: extract each step (label + input combo) into its own component,
// and use a map/enum to switch them on/off. Maybe a prop for each that accepts
// a map defined at the root of this route component that decides its hidden/shown status
import invariant from "tiny-invariant";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { getPool } from "~/utils/pool.actions";
import { Pool } from "~/models/PoolSchema";
import { User } from "~/models/UserSchema";
import { insertTransaction } from "~/utils/transactions.actions";
import { getUser, updateTransactionInProgress } from "~/utils/user.actions";

import type { LoaderDataShape } from "./index";
import LoaderDataHiddenInput from "~/components/util/LoaderDataHiddenInput";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.poolId, "Could not read $poolId in path params");
  const pool = await getPool(params.poolId);
  const currentUser = await getUser("6200824a07f36f60231a5377");
  invariant(pool, "getPool came back null");
  invariant(currentUser, "getUser came back null");
  return { poolData: pool, currentUserData: currentUser };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { poolData, currentUserData, categoryInput, memoInput } =
    Object.fromEntries(formData);
  const currentUser: User = JSON.parse(currentUserData.toString());
  const pool: Pool = JSON.parse(poolData.toString());
  invariant(currentUser, "currentUser is undefined/null");
  invariant(
    currentUser.transaction_in_progress &&
      currentUser.transaction_in_progress.total &&
      currentUser.transaction_in_progress.payees &&
      currentUser.transaction_in_progress.split_evenly != null,
    "currentUser's transactionInProgress is undefined, malformed, or incomplete"
  );
  delete currentUser.transaction_in_progress.step;
  await insertTransaction({
    pool_id: pool._id,
    split_evenly: currentUser.transaction_in_progress.split_evenly,
    total: currentUser.transaction_in_progress.total,
    transaction_date: new Date(),
    created_at: new Date(),
    owner: currentUser._id,
    category: categoryInput.toString(),
    memo: memoInput.toString(),
    payees: currentUser.transaction_in_progress.payees,
  });
  updateTransactionInProgress(currentUser._id, undefined);
  return redirect(`/pools/${pool._id}`);
};

export default function NewTransactionFinal() {
  const loaderData = useLoaderData<LoaderDataShape>();
  const transition = useTransition();
  return (
    <div>
      <Form method="post">
        <LoaderDataHiddenInput loaderData={loaderData} />
        <label htmlFor="categoryInput">Category / Memo</label>
        {/* todo: feature: this will be a single-select. data loaded from categories stored in poolData */}
        <input
          name="categoryInput"
          type="text"
          id="categoryInput"
          placeholder="Enter category here"
          className="input"
        />
        <input
          name="memoInput"
          type="text"
          id="memoInput"
          placeholder="Enter memo here"
          className="input"
        />
        <button
          name="createTransaction"
          className={`btn btn-primary rounded-lg`}
          type="submit"
        >
          {transition.state === "submitting"
            ? "Creating..."
            : "Create Transaction"}
        </button>
      </Form>
    </div>
  );
}
