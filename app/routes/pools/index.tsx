import { Link, useLoaderData, json, Form, ActionFunction } from "remix";
import { PoolModel } from "~/models/PoolSchema";
import { LeanUser } from "~/models/UserSchema";
import { getPools, deletePool } from "~/utils/pool.actions";
import invariant from "tiny-invariant";

import type { Pool } from "~/models/PoolSchema";
import { redirect } from "remix";

import type { LoaderFunction } from "remix";

export let loader: LoaderFunction = async () => {
  return json(await getPools());
};

export let action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const poolId = formData.get("pool_id");

  switch (request.method) {
    case "DELETE":
      invariant(
        poolId,
        "Trying to delete pooId failed, poolId is null or undefined"
      );
      const deleteOp = await deletePool(poolId.toString());
      console.log("Deleted pool.", deleteOp);
      return redirect("/pools");
    default:
      return redirect("/pools");
  }
};

export default function PoolsIndexRoute() {
  const poolData: Pool[] = useLoaderData();
  return (
    <div>
      <div>
        <h1>Pools</h1>
        <p>You owe: $420</p>
      </div>
      <div>
        <Link to="new">
          <button className="btn">Create Pool</button>
        </Link>
      </div>
      <hr />
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>_id</th>
              <th>Members</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {poolData.map((pool: Pool) => {
              return (
                <tr className="hover">
                  <td className="w-1/3">
                    <Link to={pool._id.toString()}>{pool._id.toString()}</Link>
                  </td>
                  <td className="w-1/3">
                    <ul>
                      {pool.members.map((user: LeanUser) => {
                        return (
                          <li key={user._id.toString()}>{user.first_name + " " + user.last_name}</li>
                        );
                      })}
                    </ul>
                  </td>
                  <td className="w-1/3">
                    <Form method="delete">
                      <input
                        hidden
                        readOnly
                        type="text"
                        name="pool_id"
                        value={pool._id.toString()}
                      />
                      <button
                        className="btn btn-primary rounded-full gap-1"
                        type="submit"
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
                    </Form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
