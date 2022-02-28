import { useReducer } from "react";
import { useOutletContext } from "remix";
import { LeanUser } from "~/models/UserSchema";
import { ContextType } from "~/routes/pools/$poolId";
import { v4 as uuidv4 } from "uuid";
interface Props {
  id: string;
  name: string;
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

export default function ({ id, name }: Props) {
  const { members } = useOutletContext<ContextType>();
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
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
    </div>
  );
}

function CustomSplitItem({ id, itemName, value, payees }: CustomSplitItemData) {
  return (
    <li key={id}>
      <input type="text" name="itemNameInput" placeholder={itemName} />
      <input type="number" name="valueInput" placeholder={value.toString()} />
      <select
        multiple
        name="payeeSelect"
        id="payeeSelect"
        className="select w-full max-w-xs"
      >
        {payees.map((payee: LeanUser) => {
          return (
            <option value={payee._id.toString()}>{payee.first_name}</option>
          );
        })}
      </select>
    </li>
  );
}
