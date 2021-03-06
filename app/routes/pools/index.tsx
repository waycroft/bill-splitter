import type { LoaderFunction } from "@remix-run/node";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { LeanUser } from "~/models/UserSchema";
import { getPools, deletePool } from "~/utils/pool.actions";
import invariant from "tiny-invariant";

import type { Pool } from "~/models/PoolSchema";
import XButton from "~/components/XButton";

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
                <tr className="hover" key={pool._id.toString()}>
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
                      <XButton />
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
