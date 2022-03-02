// todo: architecture: extract each step (label + input combo) into its own component,
// and use a map/enum to switch them on/off. Maybe a prop for each that accepts
// a map defined at the root of this route component that decides its hidden/shown status
import {
  Form,
  redirect,
  useLoaderData,
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
  // todo: architecture: refactor out of this file into pools.actions?
  const formData = await request.formData();
  console.log("formData", formData);
  const {
    totalAmountInput,
    categoryInput,
    memoInput,
    owner,
    payees,
    pool_id,
    path,
  } = Object.fromEntries(formData);
  const memberCount =
    payees
      .toString()
      .split(",")
      .filter((ele) => ele !== "").length + 1;
  // todo: architecture: should there be a Transaction class that I can construct so data transform happens automatically/in one place?
  const newTransaction: Transaction = {
    pool_id: new mongoose.Types.ObjectId(pool_id.toString()),
    // todo: feature: actually allow user input for transaction date
    transaction_date: new Date(),
    created_at: new Date(),
    total: Number(totalAmountInput),
    owner: new mongoose.Types.ObjectId(owner.toString()),
    owner_amount:
      path === "splitEvenly" ? Number(totalAmountInput) / memberCount : 0,
    category: categoryInput.toString(),
    memo: memoInput.toString(),
    payees: payees
      .toString()
      .split(",")
      .map((objIdInput: FormDataEntryValue) => {
        let objIdStr = objIdInput.toString();
        if (isValidObjectId(objIdStr)) {
          return {
            _id: new mongoose.Types.ObjectId(objIdStr),
          };
        }
      })
      .filter((ele) => {
        return ele != undefined;
      }),
  };
  insertTransaction(newTransaction);
  // todo: validation: form validation
  // todo: bug: this redirect shows the stale version of the page
  return redirect(`/pools/${pool_id}`);
};

export default function NewTransactionRoute() {
  const poolData: Pool = useLoaderData();
  const [searchParams] = useSearchParams();
  const transition = useTransition();
  const step = Number(searchParams.get("step"));
  const isSplitEvenPath = searchParams.get("path") === "splitEvenly";
  const isFinalStep =
    (isSplitEvenPath && step === 3) || (!isSplitEvenPath && step === 2.2);
  invariant(step != 0, "step search param cannot be null");
  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold">Add Transaction</h1>
      </div>
      <div>
        <Form method={isFinalStep ? "post" : "get"}>
          <fieldset className="input-group">
            {/* meta fields */}
            <input
              hidden
              readOnly
              name="step"
              value={isSplitEvenPath ? step + 1 : step + 0.1}
            />
            <input
              hidden
              readOnly
              name="owner"
              // todo: authentication: this will be the currently authenticated user
              value={"6200824a07f36f60231a5377"}
            />
            <input
              hidden
              readOnly
              name="payees"
              // todo: authentication: this will be the opposite of the currently authenticated user
              value={poolData.members
                .map((user: LeanUser) => {
                  if (user._id.toString() !== "6200824a07f36f60231a5377") {
                    return user._id.toString();
                  }
                })
                .toString()}
            />
            <input
              hidden
              readOnly
              name="pool_id"
              value={poolData._id.toString()}
            />
            {/* real input fields */}
            <label
              htmlFor="isSplitEvenly"
              className={`label ${step === 1 ? "" : "hidden"}`}
            >
              Splitting evenly?
            </label>
            <input
              defaultChecked
              name="path"
              type="checkbox"
              hidden={step === 1 ? false : true}
              className="checkbox"
              value="splitEvenly"
            />
            <label
              htmlFor="totalAmountInput"
              className={`label ${step === 2 ? "" : "hidden"}`}
            >
              Total amount?
            </label>
            <input
              name="totalAmountInput"
              type="number"
              id="totalAmountInput"
              placeholder="420"
              className="input"
              hidden={step === 2 ? false : true}
            />
            <label
              htmlFor="customSplitInput"
              className={`label ${step === 2.1 ? "" : "hidden"}`}
            >
              Custom split
            </label>
            <div className={`${step === 2.1 ? "" : "hidden"}`}>
              <CustomSplitItemList
                id="customSplitInput"
                name="customSplitInput"
              />
            </div>
            <label
              htmlFor="categoryInput"
              className={`label ${isFinalStep ? "" : "hidden"}`}
            >
              Category / Memo
            </label>
            {/* todo: feature: this will be a single-select. data loaded from categories stored in poolData */}
            <input
              name="categoryInput"
              type="text"
              id="categoryInput"
              placeholder="Enter category here"
              className="input"
              hidden={isFinalStep ? false : true}
            />
            <input
              name="memoInput"
              type="text"
              id="memoInput"
              placeholder="Enter memo here"
              className="input"
              hidden={isFinalStep ? false : true}
            />
            <button
              type="submit"
              className={`btn btn-secondary rounded-md ${
                isFinalStep ? "hidden" : ""
              }`}
            >
              Next 👉
            </button>
            <button
              name="createTransaction"
              className={`btn btn-primary rounded-md ${
                isFinalStep ? "" : "hidden"
              }`}
              type="submit"
            >
              {transition.state === "submitting"
                ? "Creating Transaction..."
                : "Create Transaction"}
            </button>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
