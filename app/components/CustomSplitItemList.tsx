import { useReducer } from "react";
import { LeanUser } from "~/models/UserSchema";

interface Props {
  id: string;
  name: string;
  payees: LeanUser[];
}

interface CustomSplitItemData {
  itemName: string;
  value: number;
  payees: LeanUser[];
}

interface ReducerAction {
  type: "ADD" | "REMOVE";
  payload: CustomSplitItemData;
}

const reducer = (state: CustomSplitItemData[], action: ReducerAction) => {
  switch (action.type) {
    case "ADD":
      return state.concat(action.payload);
    default:
      throw new Error("Missing/bad reducer action");
  }
};

export default function ({ id, name, payees }: Props) {
  const initial: CustomSplitItemData[] = [
    {
      itemName: "",
      value: 0,
      payees: payees
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
                itemName={item.itemName}
                value={item.value}
                payees={item.payees}
              />
              <button
                className="btn btn-primary rounded-full gap-1"
                type="button"
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
          onClick={(e) => dispatch({ type: "ADD", payload: initial[0] })}
        >
          Add another
        </button>
      </ul>
    </div>
    // item list goes here, basically just some inputs (but not a form because supposedly you cant nest forms)
  );
}

function CustomSplitItem({ itemName, value, payees }: CustomSplitItemData) {
  // single list item, aka collection of fields and a delete button
  console.log('CustomSplitItem payees:', payees);
  return (
    <li>
      <input type="text" name="itemNameInput" placeholder={itemName} />
      <input type="number" name="valueInput" placeholder={value.toString()} />
      <select name="payeeSelect" id="payeeSelect">
        {payees.map((payee: LeanUser) => {
          return (
            <option value={payee._id.toString()}>{payee.first_name}</option>
          );
        })}
      </select>
    </li>
  );
}
