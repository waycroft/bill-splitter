import { Form, redirect, useLoaderData, useTransition } from "remix";
import { useEffect, useReducer, useState } from "react";
import invariant from "tiny-invariant";
import { v4 as uuidv4 } from "uuid";
import { getPool } from "~/utils/pool.actions";
import { Pool } from "~/models/PoolSchema";
import { User } from "~/models/UserSchema";
import { getUser } from "~/utils/user.actions";
import LoaderDataHiddenInput from "~/components/util/LoaderDataHiddenInput";
import CustomSplitItem from "~/components/CustomSplitItem";
import XButton from "~/components/XButton";
import { updateTransactionInProgress } from "~/utils/user.actions";
import { isValidObjectId, Types } from "mongoose";

import type { LoaderFunction, ActionFunction } from "remix";
import type { LoaderDataShape } from "../index";
import type { CustomSplitItemData } from "~/components/CustomSplitItem";
import type {
  PayeeData,
  SplitItem,
  TransactionInProgress,
} from "~/models/TransactionSchema";
import { LeanUser } from "~/models/UserSchema";

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
  const { poolData, currentUserData } = Object.fromEntries(formData);
  const pool: Pool = JSON.parse(poolData.toString());
  const currentUser: User = JSON.parse(currentUserData.toString());
  invariant(pool, "pool is undefined/null");
  invariant(currentUser, "currentUser is undefined/null");
  try {
    let splitItems: CustomSplitItemData[] = [];
    for (const item of formData.getAll("splitItemsData")) {
      splitItems.push(JSON.parse(item.toString()));
    }
    const transactionInProgress: TransactionInProgress = {
      step: 3,
      payees: processPayeeData(splitItems),
    };
    await updateTransactionInProgress(currentUser._id, transactionInProgress);
    return redirect(`/pools/${pool._id}/transactions/new/final`);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Takes the incoming custom split item formData and shapes it so it fits the Transaction schema.
 * @param customSplitItems The custom split items coming from the form data
 * @returns {PayeeData[]} An array of PayeeData for the eventual Transaction document
 */
function processPayeeData(
  customSplitItems: CustomSplitItemData[]
): PayeeData[] {
  let hash: { [_id: string]: { total_amount: number; items: SplitItem[] } } =
    {};
  for (const item of customSplitItems) {
    // todo: refactor: no nested loops! Maybe worth re-configuring the input data so it's closer to the necessary shape
    for (const payee of item.payees) {
      const _id = payee._id.toString();
      if (!isValidObjectId(_id))
        throw "invalid Object ID passed to processPayeeData";
      if (!hash[_id]) {
        hash[_id] = { total_amount: 0, items: [] };
      }
      hash[_id].total_amount += item.amount / item.payees.length;
      hash[_id].items.push({ name: item.name, amount: item.amount });
    }
  }
  let res: PayeeData[] = [];
  for (const [key, val] of Object.entries(hash)) {
    res.push({
      _id: new Types.ObjectId(key),
      total_amount: val.total_amount,
      items: val.items,
    });
  }
  return res;
}

export type ReducerAction =
  | { type: "ADD"; payload: { payees: LeanUser[] } }
  | { type: "REMOVE"; itemToRemoveId: string }
  | {
      type: "UPDATE";
      target: string;
      payload: CustomSplitItemData;
    };

const reducer = (state: CustomSplitItemData[], action: ReducerAction) => {
  switch (action.type) {
    case "ADD":
      return state.concat({
        id: uuidv4(),
        // todo: fun: random name each new item
        name: "",
        amount: 0,
        payees: action.payload.payees,
      });
    case "UPDATE":
      for (let i = 0; i < state.length; i++) {
        if (state[i].id === action.target) {
          state[i] = action.payload;
        }
      }
      // interesting quirk of useReducer: It uses Object.is() algorithm to determine if the returned value here is equivalent to the prev state. If it is, it WILL NOT re-render the component, and will return stale state.
      // So the workaround is to duplicate the state to force return a new object in memory, which is how Object.is() determines if items are equivalent or not.
      return [...state];
    case "REMOVE":
      return state.filter((item) => {
        return item.id !== action.itemToRemoveId;
      });
    default:
      throw new Error("Missing/bad reducer action");
  }
};

export default function CustomSplitStep2() {
  const loaderData = useLoaderData<LoaderDataShape>();
  const transition = useTransition();
  const initial: CustomSplitItemData[] = [
    {
      id: uuidv4(),
      name: "",
      amount: 0,
      payees: loaderData.poolData.members,
    },
  ];
  const [state, dispatch] = useReducer(reducer, initial);
  const [remainingAmount, setRemainingAmount] = useState(
    loaderData.currentUserData.transaction_in_progress.total
  );
  useEffect(() => {
    let totalToDeduct = 0;
    for (const splitItem of state) {
      totalToDeduct += splitItem.amount;
    }
    setRemainingAmount(() => {
      // keeps REMOVING from remainingAmount but not re-adding back the value if deleting...
      invariant(
        loaderData.currentUserData.transaction_in_progress.total != null,
        "transaction_in_progress.total was undefined/null"
      );
      return (
        loaderData.currentUserData.transaction_in_progress.total - totalToDeduct
      );
    });
  }, [state]);
  return (
    <div>
      <h1>Custom Split</h1>
      <h2>
        {/* todo: validation: show error color when amount is negative */}
        Remaining amount: <strong>${remainingAmount}</strong>
      </h2>
      <div>
        {/* these inputs are not submitted with the form, but rather are passed to the hidden inputs below in the <Form> which actually submit the state */}
        {state.map((item) => {
          return (
            <div key={item.id}>
              <CustomSplitItem
                id={item.id}
                name={item.name}
                amount={item.amount}
                payees={item.payees}
                dispatch={dispatch}
              />
              <button
                className="btn btn-primary rounded-full gap-1"
                type="button"
                onClick={() =>
                  dispatch({ type: "REMOVE", itemToRemoveId: item.id })
                }
              >
                <XButton />
              </button>
            </div>
          );
        })}
        <button
          name="addItem"
          type="button"
          onClick={() =>
            dispatch({
              type: "ADD",
              payload: {
                payees: loaderData.poolData.members,
              },
            })
          }
          className="btn btn-accent rounded"
        >
          Add another
        </button>
        {/* todo: validation: display remaining amount as user adds splits, like YNAB. This will also be part of the form validation */}
      </div>
      <Form method="post">
        {/* todo: refactor: is it possible to pass a type param to loaderData here? */}
        <LoaderDataHiddenInput loaderData={loaderData} />
        {state.map((splitItem: CustomSplitItemData) => {
          return (
            <fieldset key={splitItem.id}>
              <input
                hidden
                readOnly
                type="text"
                name="splitItemsData"
                value={JSON.stringify(splitItem)}
              />
            </fieldset>
          );
        })}
        <button type="submit" className={`btn btn-secondary rounded-md`}>
          {transition.state === "submitting" ? "Nexting..." : "Next 👉"}
        </button>
      </Form>
    </div>
  );
}
