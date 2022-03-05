import { Form, redirect, useLoaderData, useTransition } from "remix";
import invariant from "tiny-invariant";
import { v4 as uuidv4 } from "uuid";
import { useReducer } from "react";
import { getPool } from "~/utils/pool.actions";
import { Pool } from "~/models/PoolSchema";
import { User } from "~/models/UserSchema";
import { getUser } from "~/utils/user.actions";
import LoaderDataHiddenInput from "~/components/util/LoaderDataHiddenInput";
import CustomSplitItem from "~/components/CustomSplitItem";
import { debounce } from "lodash";
import XButton from "~/components/XButton";

import type { LoaderFunction, ActionFunction } from "remix";
import type { LoaderDataShape } from "../index";
import type { CustomSplitItemData } from "~/components/CustomSplitItem";
import type { ReducerAction } from "~/components/CustomSplitItem";

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
  console.log(formData);
  const currentUser: User = JSON.parse(currentUserData.toString());
  const pool: Pool = JSON.parse(poolData.toString());
  invariant(currentUser, "currentUser is undefined/null");
  invariant(pool, "pool is undefined/null");
  return redirect(`/pools/${pool._id}`);
};

const reducer = (state: CustomSplitItemData[], action: ReducerAction) => {
  switch (action.type) {
    case "ADD":
      return state.concat(action.payload);
    case "REMOVE":
      return state.filter((item) => {
        return item.id !== action.itemToRemoveId;
      });
    case "UPDATE":
      return state;
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
      itemName: "garlic fries",
      amount: 0,
      payees: loaderData.poolData.members,
    },
  ];
  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("changed: ", e);
    // possible to just input.get the values of all the inputs instead 
    // of messing around with switch-ing the target of the input?
    // dispatch({
    //   type: "UPDATE",
    //   payload: e.target.value,
    // });
  }
  const [state, dispatch] = useReducer(reducer, initial);
  return (
    <div>
      <h1>Custom Split</h1>
      {/* these inputs are not submitted with the form, but rather are passed to the hidden inputs below in the <Form> which actually submit the state */}
      <div>
        {state.map((item) => {
          return (
            <div key={item.id}>
              <CustomSplitItem
                id={item.id}
                itemName={item.itemName}
                amount={item.amount}
                payees={item.payees}
                changeHandler={debounce(changeHandler, 1000)}
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
                id: uuidv4(),
                // todo: fun: random name each new item
                itemName: "mocha matcha",
                amount: 0,
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
                name="splitItems"
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
