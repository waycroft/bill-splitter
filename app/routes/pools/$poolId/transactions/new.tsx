// todo: architecture: extract each step (label + input combo) into its own component,
// and use a map/enum to switch them on/off. Maybe a prop for each that accepts
// a map defined at the root of this route component that decides its hidden/shown status
import { Form, redirect, useLoaderData, useSearchParams } from "remix";
import invariant from "tiny-invariant";
import { getPool } from "~/utils/pool.actions";
import { insertTransaction } from "~/utils/transactions.actions";
import { PayeeData } from "~/models/TransactionSchema";
import CustomSplitItemList from "~/components/CustomSplitItemList";
import { Pool } from "~/models/PoolSchema";
import { LeanUser } from "~/models/UserSchema";
import mongoose, { isValidObjectId } from "mongoose";

import type { LoaderFunction, ActionFunction } from "remix";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.poolId, "Could not read $poolId in path params");
  const pool = await getPool(params.poolId);
  invariant(pool, "getPool came back null");
  return pool;
};

interface RawTransactionInput {
  totalAmountInput: number;
  categoryInput: string;
  memoInput: string;
  owner: string;
  payees: string;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { totalAmountInput, categoryInput, memoInput, owner, payees } =
    Object.fromEntries(formData);
  const newTransaction = {
    // todo: feature: actually allow user input for transaction date
    transaction_date: new Date(),
    created_at: new Date(),
    total: Number(totalAmountInput),
    owner: new mongoose.Types.ObjectId(owner.toString()),
    category: categoryInput,
    memo: memoInput,
    payees: payees
      .toString()
      .split(",")
      .map((objIdInput: FormDataEntryValue) => {
        let objIdStr = objIdInput.toString();
        if (isValidObjectId(objIdStr)) {
          return new mongoose.Types.ObjectId(objIdStr);
        }
      })
      .filter((ele) => {
        return ele != undefined;
      }),
  };
  // todo: validation: form validation
  return redirect("new");
};

export default function NewTransactionRoute() {
  const poolData: Pool = useLoaderData();
  const [searchParams] = useSearchParams();
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
              Create Transaction
            </button>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
