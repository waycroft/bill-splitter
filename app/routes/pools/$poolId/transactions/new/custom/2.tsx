// todo: architecture: extract each step (label + input combo) into its own component,
// and use a map/enum to switch them on/off. Maybe a prop for each that accepts
// a map defined at the root of this route component that decides its hidden/shown status
import invariant from "tiny-invariant";
import { Form, redirect, useLoaderData, useTransition } from "remix";
import { getPool } from "~/utils/pool.actions";
import { Pool } from "~/models/PoolSchema";
import { User } from "~/models/UserSchema";
import { getUser } from "~/utils/user.actions";

import type { LoaderFunction, ActionFunction } from "remix";
import type { LoaderDataShape } from "../index";
import LoaderDataHiddenInput from "~/components/util/LoaderDataHiddenInput";
import CustomSplitItemList from "~/components/CustomSplitItemList";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.poolId, "Could not read $poolId in path params");
  const pool = await getPool(params.poolId);
  const currentUser = await getUser("6200824a07f36f60231a5377");
  invariant(pool, "getPool came back null");
  invariant(currentUser, "getUser came back null");
  return { poolData: pool, currentUserData: currentUser };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { poolData, currentUserData } = Object.fromEntries(formData);
  const currentUser: User = JSON.parse(currentUserData.toString());
  const pool: Pool = JSON.parse(poolData.toString());
  invariant(currentUser, "currentUser is undefined/null");
  return redirect(`/pools/${pool._id}`);
};

export default function CustomSplitStep2() {
  const loaderData = useLoaderData<LoaderDataShape>();
  const transition = useTransition();
  return (
    <div>
      <Form method="post">
        {/* todo: refactor: is it possible to pass a type param to loaderData here? */}
        <LoaderDataHiddenInput loaderData={loaderData} />
        <label htmlFor="categoryInput">Category / Memo</label>
        <CustomSplitItemList poolData={loaderData.poolData} />
        <button type="submit" className={`btn btn-secondary rounded-md`}>
          {transition.state === "submitting" ? "Nexting..." : "Next 👉"}
        </button>
      </Form>
    </div>
  );
}
