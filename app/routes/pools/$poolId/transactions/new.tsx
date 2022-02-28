// todo: extract each step (label + input combo) into its own component,
// and use a map/enum to switch them on/off. Maybe a prop for each that accepts
// a map defined at the root of this route component that decides its hidden/shown status
import { Form, redirect, useLoaderData, useSearchParams } from "remix";
import invariant from "tiny-invariant";
import { getPool } from "~/utils/pool.actions";

import type { LoaderFunction, ActionFunction } from "remix";
import { upsertTransaction } from "~/utils/transactions.actions";
import { PayeeData } from "~/models/TransactionSchema";
import CustomSplitItemList from "~/components/CustomSplitItemList";
import { Pool } from "~/models/PoolSchema";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.poolId, "Could not read $poolId in path params");
  const pool = await getPool(params.poolId);
  invariant(pool, "getPool came back null");
  return pool;
};

interface RawTransactionInput {
  total: number;
  isSplitEvenly: boolean;
  memberCount: number;
  transaction_date: string;
  owner: string;
  owner_amount: string;
  category: string;
  memo: string;
  payees: PayeeData[];
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { poolData, total, owner } = Object.fromEntries(formData);
  // todo: form validation
  return redirect("new");
};

export default function NewTransactionRoute() {
  const poolData: Pool = useLoaderData();
  console.log(poolData);
  const [searchParams] = useSearchParams();
  const step = Number(searchParams.get("step"));
  const isSplitEvenPath = !!searchParams.get("path::splitEven");
  console.log("isSplitEvenPath:", isSplitEvenPath);
  const isFinalStep =
    (isSplitEvenPath && step === 3) || (!isSplitEvenPath && step === 7);
  invariant(step != 0, "step search param cannot be null");
  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold">Add Transaction</h1>
      </div>
      <div>
        <Form method={isFinalStep ? "post" : "get"}>
          <fieldset className="input-group">
            <input
              hidden
              readOnly
              name="step"
              value={isSplitEvenPath ? step + 1 : step + 0.1}
            />
            <label
              htmlFor="isSplitEvenly"
              className={`label ${step !== 1 ? "hidden" : ""}`}
            >
              Splitting evenly?
            </label>
            <input
              defaultChecked
              name="path::splitEven"
              type="checkbox"
              hidden={step !== 1 ? true : false}
              className="checkbox"
              value="true"
            />
            <label
              htmlFor="totalAmountInput"
              className={`label ${step !== 2 ? "hidden" : ""}`}
            >
              Total amount?
            </label>
            <input
              name="totalAmountInput"
              type="number"
              id="totalAmountInput"
              defaultValue={0}
              className="input"
              hidden={step !== 2 ? true : false}
            />
            <label
              htmlFor="customSplitInput"
              className={`label ${step !== 2.1 ? "hidden" : ""}`}
            >
              Custom split
            </label>
            <div className={`${step !== 2.1 ? "hidden" : ""}`}>
              <CustomSplitItemList
                id="customSplitInput"
                name="customSplitInput"
              />
            </div>
            <label
              htmlFor="categoryInput"
              className={`label ${step !== 3 ? "hidden" : ""}`}
            >
              Category / Memo
            </label>
            <input
              name="categoryInput"
              type="text"
              id="categoryInput"
              placeholder="Enter category here"
              className="input"
              hidden={step !== 3 ? true : false}
            />
            <input
              name="memoInput"
              type="text"
              id="memoInput"
              placeholder="Enter memo here"
              className="input"
              hidden={step !== 3 ? true : false}
            />
            <button type="submit" className="btn btn-secondary rounded-md">
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
