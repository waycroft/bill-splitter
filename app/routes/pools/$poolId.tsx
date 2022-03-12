import { Outlet, useLoaderData, json, Link } from "remix";
import invariant from "tiny-invariant";
import { getPool } from "~/utils/pool.actions";
import { Pool } from "~/models/PoolSchema";
import { LeanUser } from "~/models/UserSchema";

import type { LoaderFunction } from "remix";

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.poolId, "No pool ID");
  return await getPool(params.poolId);
};

export default function PoolRoute() {
  const data = useLoaderData<Pool>();
  return (
    <div className="container mx-auto">
      <Link to="/pools">
        <button className="btn btn-secondary rounded-lg">Back</button>
      </Link>
      <div className="avatar-group">
        {data.members.map((member: LeanUser) => {
          return (
            <div
              className="avatar placeholder"
              id={member._id.toString()}
              key={member._id.toString()}
            >
              <div className="w-12 bg-base-200">
                {/* todo: accessibility: use actual ul element for no-js/accessibility */}
                <span>{member.first_name[0] + member.last_name[0]}</span>
              </div>
            </div>
          );
        })}
      </div>
      <Link to={`transactions/new`}>
        <button className="btn btn-primary rounded-lg">Add transaction</button>
      </Link>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
