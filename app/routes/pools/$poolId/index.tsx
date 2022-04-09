import { LoaderFunction, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { getPool } from "~/utils/pool.actions";

import type { Pool } from "~/models/PoolSchema";
import type { LeanUser } from "~/models/UserSchema";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.poolId, "pool id param is undefined");
  return await getPool(params.poolId);
};

export default function PoolBody() {
  const poolData = useLoaderData<Pool>();
  const members = poolData.members;
  // const currentUser = poolData.members;
  return (
    <div>
      <div>
        {members.map((user: LeanUser) => {
          return (
            <p>{user.first_name}: <strong>${user.balance}</strong></p>
          )
        })}
        {/* {currentUser.balance > 0 ? (
          <h1>
            You owe: <span>{currentUser.balance}</span>
          </h1>
        ) : currentUser.balance < 0 ? (
          <h1>
            They owe you: <span>{currentUser.balance}</span>
          </h1>
        ) : (
          <h1>You're all even!</h1>
        )} */}
      </div>
    </div>
  );
}
