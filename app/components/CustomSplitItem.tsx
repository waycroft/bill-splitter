import { useEffect, useState } from "react";
import { LeanUser } from "~/models/UserSchema";
import { SplitItem } from "~/models/TransactionSchema";

export interface CustomSplitItemData extends SplitItem {
  id: string;
  dispatch?: any;
  payees: LeanUser[];
}

interface PayeeSelectStatus {
  [_id: string]: boolean;
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
  const initSelectedPayees: PayeeSelectStatus = Object.fromEntries(
    payees.map((payee: LeanUser) => {
      return [payee._id.toString(), false];
    })
  )
  const [payeeSelectedState, setPayeeSelectedState] =
    useState<PayeeSelectStatus>(initSelectedPayees);
  // todo: optimization: debounce instead of useEffect
  useEffect(() => {
    dispatch({
      type: "UPDATE",
      target: id,
      payload: {
        id: id,
        name: nameState,
        amount: amountState,
        payees: payees,
        selectedPayees: payeeSelectedState,
      },
    });
  }, [nameState, amountState, payeeSelectedState]);
  function handlePayeeSelect(e) {
    setPayeeSelectedState((prevState) => {
      prevState[e.target.value] = !prevState[e.target.value];
      return {...prevState};
    });
  }
  return (
    <div>
      <fieldset>
        <label htmlFor="nameInput" className="label">
          Item name
        </label>
        <input
          type="text"
          id="nameInput"
          name={nameState}
          className="input"
          onChange={(e) => setNameState(e.target.value)}
        />
        <label htmlFor="amountInput" className="label">
          Amount
        </label>
        <input
          type="number"
          id="amountInput"
          step="0.01"
          name={amountState.toString()}
          className="input"
          onChange={(e) => setAmountState(Number(e.target.value))}
        />
        {/* todo: validation: should not be able to select all payees */}
        {/* todo: feature: use "me" as an option, and make it the first option */}
        <div className="form-control">
          <label className="label cursor-pointer">Payees:</label>
          {payees.map((payee: LeanUser) => {
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
                  checked={payeeSelectedState[payee._id.toString()]}
                  onChange={handlePayeeSelect}
                />
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
