import {
  Form,
  redirect,
  useLoaderData,
  useParams,
  useSearchParams,
} from "remix";
import invariant from "tiny-invariant";
import { getPool } from "~/utils/pool.actions";

import type { LoaderFunction, ActionFunction } from "remix";
import { upsertTransaction } from "~/utils/transactions.actions";
import { PayeeData } from "~/models/TransactionSchema";

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
  const poolData = useLoaderData();
  const [searchParams] = useSearchParams();
  const step = searchParams.get("step");
  invariant(step !== null, "step search param cannot be null");
  console.log("step", step);
  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold">Add Transaction</h1>
      </div>
      <div>
        <Form method="get">
          <fieldset className="input-group">
            <label
              htmlFor="isSplitEvenly"
              className={Number(step) !== 1 ? "label hidden" : "label"}
            >
              Splitting evenly?
            </label>
            <input
              name="isSplitEvenly"
              type="checkbox"
              hidden={Number(step) !== 1 ? true : false}
              value="checked"
              className="checkbox"
            />
            <label
              htmlFor="totalAmountInput"
              className={Number(step) !== 2 ? "label hidden" : "label"}
            >
              Total amount?
            </label>
            <input
              name="totalAmountInput"
              type="number"
              id="totalAmountInput"
              defaultValue={0}
              className="input"
              hidden={Number(step) !== 2 ? true : false}
            />
            <label
              htmlFor="totalAmountInput"
              className={Number(step) !== 2 ? "label hidden" : "label"}
            >
              Duck?
            </label>
            <input
              type="number"
              name="totalAmountInput"
              id="totalAmountInput"
              defaultValue={0}
              className="input"
              hidden={Number(step) !== 2 ? true : false}
            />
            <button className="btn btn-primary rounded-md" type="submit">
              Create Transaction
            </button>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
