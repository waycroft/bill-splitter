import { LeanUser } from "~/models/UserSchema";
import { useEffect, useState } from "react";
import { SplitItem } from "~/models/TransactionSchema";

export type ReducerAction =
  | { type: "ADD"; payload: CustomSplitItemData }
  | { type: "REMOVE"; itemToRemoveId: string }
  | {
      type: "UPDATE";
      target: string;
      payload: CustomSplitItemData;
    };

export interface CustomSplitItemData extends SplitItem {
  id: string;
  dispatch?: any;
}

export default function ({
  id,
  name,
  amount,
  payees,
  dispatch,
}: CustomSplitItemData) {
  const [nameState, setNameState] = useState(name);
  const [amountState, setAmountState] = useState(amount);
  const [payeeState, setPayeeState] = useState(payees);
  // todo: optimization: debounce instead of useEffect
  useEffect(() => {
    dispatch({
      type: "UPDATE",
      target: id,
      payload: {
        id: id,
        name: nameState,
        amount: amountState,
        payees: payeeState,
      },
    });
  }, [nameState, amountState, payeeState]);
  return (
    <div>
      <fieldset>
        <label htmlFor="nameInput" className="label">Item name</label>
        <input
          type="text"
          id="nameInput"
          name={nameState}
          className="input"
          onChange={(e) => setNameState(e.target.value)}
        />
        <label htmlFor="amountInput" className="label">Amount</label>
        <input
          type="number"
          id="amountInput"
          step="0.01"
          name={amountState.toString()}
          className="input"
          onChange={(e) => setAmountState(Number(e.target.value))}
        />
        {/* todo: validation: should not be able to select all payees */}
        <div className="form-control">
          <label className="label cursor-pointer">Payees:</label>
          {payeeState.map((payee: LeanUser) => {
            return (
              <div key={payee._id.toString()}>
                <span className="label-text">
                  {payee.first_name + " " + payee.last_name[0]}
                </span>
                <input
                  type="checkbox"
                  id="payeesInput"
                  name="payeesInput"
                  className="checkbox"
                  value={payee._id.toString()}
                  onChange={(e) => console.log(e.target.checked)}
                />
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
