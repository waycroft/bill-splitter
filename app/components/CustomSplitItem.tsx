import { LeanUser } from "~/models/UserSchema";
import { v4 as uuidv4 } from "uuid";
import { Pool } from "~/models/PoolSchema";
import XButton from "./XButton";
import React, { ReactEventHandler } from "react";
import { debounce } from "lodash";

interface Props {
  poolData: Pool;
  state: CustomSplitItemData[];
  dispatch: React.Dispatch<ReducerAction>;
}

export type ReducerAction =
  | { type: "ADD"; payload: CustomSplitItemData }
  | { type: "REMOVE"; itemToRemoveId: string }
  | {
      type: "UPDATE";
      payload: CustomSplitItemData;
    };

export interface CustomSplitItemData {
  id: string;
  itemName: string;
  amount: number;
  payees: LeanUser[];
  changeHandler?: (e: React.ChangeEventHandler<HTMLInputElement>) => void;
}

export default function ({
  id,
  itemName,
  amount,
  payees,
  changeHandler,
}: CustomSplitItemData) {
  return (
    <div>
      <fieldset onChange={changeHandler}>
        <input
          type="text"
          id="itemNameInput"
          name={itemName}
          placeholder={itemName}
          className="input"
        />
        <input
          type="number"
          id="amountInput"
          step="0.01"
          name={amount.toString()}
          placeholder={amount.toString()}
          className="input"
        />
        {/* todo: validation: should not be able to select all payees */}
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
                  className="checkbox"
                  name="payeesInput"
                  value={payee._id.toString()}
                />
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
