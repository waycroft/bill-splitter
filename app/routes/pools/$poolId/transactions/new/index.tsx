// todo: architecture: extract each step (label + input combo) into its own component,
// and use a map/enum to switch them on/off. Maybe a prop for each that accepts
// a map defined at the root of this route component that decides its hidden/shown status
import { Form, redirect, useLoaderData, useTransition } from "remix";
import invariant from "tiny-invariant";
import { getPool } from "~/utils/pool.actions";
import { Pool } from "~/models/PoolSchema";
import { User } from "~/models/UserSchema";
import { getUser, updateTransactionInProgress } from "~/utils/user.actions";
import type { LoaderFunction, ActionFunction } from "remix";
import type { TransactionInProgress } from "~/models/TransactionSchema";
export interface LoaderDataShape {
  poolData: Pool;
  currentUserData: User;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.poolId, "Could not read $poolId in path params");
  const pool = await getPool(params.poolId);
  const currentUser = await getUser("6200824a07f36f60231a5377");
  invariant(pool, "getPool came back null");
  invariant(currentUser, "getUser came back null");
  return { pool: pool, currentUser: currentUser };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  let { isSplitEvenly, totalAmountInput, currentUserData, poolData } =
    Object.fromEntries(formData);
  let currentUser: User = JSON.parse(currentUserData.toString());
  let pool: Pool = JSON.parse(poolData.toString());
  let transactionInProgress: TransactionInProgress;
  switch (Boolean(isSplitEvenly)) {
    case true:
      transactionInProgress = {
        step: 2,
        split_evenly: true,
        total: Number(totalAmountInput),
        pool_id: pool._id,
      };
      await updateTransactionInProgress(currentUser._id, transactionInProgress);
      return redirect(`${request.url}/final`);
    default:
      transactionInProgress = {
        step: 2,
        split_evenly: true,
        total: Number(totalAmountInput),
        pool_id: pool._id,
      };
      await updateTransactionInProgress(currentUser._id, transactionInProgress);
      return redirect(`${request.url}/custom/2`);
  }
};

export default function NewTransactionIndexRoute() {
  const loaderData = useLoaderData<LoaderDataShape>();
  const transition = useTransition();
  return (
    <div>
      <Form method="post">
        <input
          readOnly
          hidden
          name="poolData"
          value={JSON.stringify(loaderData.poolData)}
        />
        <input
          readOnly
          hidden
          name="currentUserData"
          value={JSON.stringify(loaderData.currentUserData)}
        />
        <label htmlFor="totalAmountInput">Total amount?</label>
        <input
          name="totalAmountInput"
          type="number"
          id="totalAmountInput"
          placeholder="420"
          className="input"
          step={0.01}
        />
        <label htmlFor="isSplitEvenly">Splitting evenly?</label>
        <input
          defaultChecked
          name="isSplitEvenly"
          id="isSplitEvenly"
          type="checkbox"
          className="checkbox"
        />
        <button type="submit" className={`btn btn-secondary rounded-md`}>
          {transition.state === "submitting" ? "Nexting..." : "Next 👉"}
        </button>
      </Form>
    </div>
  );
}
