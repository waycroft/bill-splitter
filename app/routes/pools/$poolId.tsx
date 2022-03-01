import { Outlet, useLoaderData, json, Link } from "remix";
import invariant from "tiny-invariant";
import { getPool } from "~/utils/pool.actions";
import { Pool } from "~/models/PoolSchema";
import { LeanUser } from "~/models/UserSchema";

import type { LoaderFunction } from "remix";

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.poolId, "No pool ID");
  return json(await getPool(params.poolId));
};

export type ContextType = {
  members: LeanUser[];
}

export default function PoolRoute() {
  const data: Pool = useLoaderData<Pool>();
  const context: ContextType = { members: data.members };
  return (
    <div className="container mx-auto">
      <div className="avatar-group">
        {data.members.map((member: LeanUser) => {
          return (
            <div className="avatar placeholder">
              <div className="w-12 bg-base-200">
                {/* todo: accessibility: use actual ul element for no-js/accessibility */}
                <span>{member.first_name[0] + member.last_name[0]}</span>
              </div>
            </div>
          );
        })}
      </div>
      <Link to={`transactions/new?step=1&path=splitEvenly`}>
        <button className="btn">Add transaction</button>
      </Link>
      <div>
        <Outlet context={context}/>
      </div>
    </div>
  );
}
