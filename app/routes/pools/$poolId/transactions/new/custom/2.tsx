// todo: architecture: extract each step (label + input combo) into its own component,
// and use a map/enum to switch them on/off. Maybe a prop for each that accepts
// a map defined at the root of this route component that decides its hidden/shown status
import {
  Form,
  redirect,
  useLoaderData,
  useMatches,
  useSearchParams,
  useTransition,
} from "remix";
import invariant from "tiny-invariant";
import { getPool } from "~/utils/pool.actions";
import CustomSplitItemList from "~/components/CustomSplitItemList";
import { Pool } from "~/models/PoolSchema";
import { LeanUser } from "~/models/UserSchema";
import mongoose, { isValidObjectId } from "mongoose";
import { insertTransaction } from "~/utils/transactions.actions";

import type { LoaderFunction, ActionFunction } from "remix";
import type { Transaction } from "~/models/TransactionSchema";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.poolId, "Could not read $poolId in path params");
  const pool = await getPool(params.poolId);
  invariant(pool, "getPool came back null");
  return pool;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { isSplitEvenly } = Object.fromEntries(formData);
  switch (Boolean(isSplitEvenly)) {
    case true:
      return redirect("evenly/2");
    default:
      return redirect("custom/2");
  }
};

export default function SplitEvenlyStep2Route() {
  const poolData: Pool = useLoaderData();
  const transition = useTransition();
  return (
    <div>
      <label htmlFor="customSplitInput">Custom split</label>
      <div>
        <CustomSplitItemList
          id="customSplitInput"
          name="customSplitInput"
          poolData={poolData}
        />
      </div>
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
      <button type="submit" className="btn btn-primary rounded">
        Next 👉
      </button>
      <button
        name="createTransaction"
        className={`btn btn-primary rounded-md`}
        type="submit"
      >
        {transition.state === "submitting"
          ? "Creating Transaction..."
          : "Create Transaction"}
      </button>
    </div>
  );
}
