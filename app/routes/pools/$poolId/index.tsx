import { LoaderFunction, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { getPool } from "~/utils/pool.actions";

import type { Pool } from "~/models/PoolSchema";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.poolId, "pool id param is undefined");
  return await getPool(params.poolId);
};

export default function PoolBody() {
  const poolData = useLoaderData<Pool>();
  return (
    <div>
      <p>{JSON.stringify(poolData.transactions, null, '\t')}</p>
    </div>
  );
}
