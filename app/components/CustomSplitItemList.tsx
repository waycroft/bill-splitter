import { useReducer } from "react";
import { LeanUser } from "~/models/UserSchema";
import { v4 as uuidv4 } from "uuid";
import { Pool } from "~/models/PoolSchema";
import XButton from "./XButton";

interface Props {
  id: string;
  name: string;
  poolData: Pool;
}

interface CustomSplitItemData {
  id: string;
  itemName: string;
  value: number;
  payees: LeanUser[];
}

type ReducerAction =
  | { type: "ADD"; payload: CustomSplitItemData }
  | { type: "REMOVE"; itemToRemoveId: string };

const reducer = (state: CustomSplitItemData[], action: ReducerAction) => {
  switch (action.type) {
    case "ADD":
      return state.concat(action.payload);
    case "REMOVE":
      return state.filter((item) => {
        return item.id !== action.itemToRemoveId;
      });
    default:
      throw new Error("Missing/bad reducer action");
  }
};

export default function ({ id, name, poolData }: Props) {
  const members = poolData.members;
  const initial: CustomSplitItemData[] = [
    {
      id: uuidv4(),
      itemName: "garlic fries",
      value: 0,
      payees: members,
    },
  ];
  const [state, dispatch] = useReducer(reducer, initial);
  return (
    <div>
      <ul>
        {state.map((item) => {
          return (
            <div>
              <CustomSplitItem
                id={item.id}
                itemName={item.itemName}
                value={item.value}
                payees={item.payees}
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
                value: 0,
                payees: members,
              },
            })
          }
          className="btn btn-accent rounded"
        >
          Add another
        </button>
      </ul>
      {/* todo: validation: display remaining amount as user adds splits, like YNAB. This will also be part of the form validation */}
    </div>
  );
}

function CustomSplitItem({ id, itemName, value, payees }: CustomSplitItemData) {
  return (
    <li key={id}>
      <input type="text" name="itemNameInput" placeholder={itemName} />
      <input type="number" name="valueInput" placeholder={value.toString()} />
      {/* todo: validation: should not be able to select all payees */}
      <select
        multiple
        name="payeeSelect"
        id="payeeSelect"
        className="select w-full max-w-xs"
      >
        {payees.map((payee: LeanUser) => {
          return (
            <option value={payee._id.toString()}>
              {payee.first_name + " " + payee.last_name[0]}
            </option>
          );
        })}
      </select>
    </li>
  );
}
