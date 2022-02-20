import { useParams, Outlet, useLoaderData, json } from 'remix';
import type { LoaderFunction } from 'remix';
import { getPool } from '~/utils/pool.actions';
import invariant from 'tiny-invariant';
import { Pool } from '~/models/PoolSchema';
import { LeanUser } from '~/models/UserSchema';

export let loader: LoaderFunction = async ({ params }) => {
    invariant(params.poolId, "No pool ID")
    return json(await getPool(params.poolId));
}

export default function PoolRoute() {
    const params = useParams();
    const data: Pool = useLoaderData<Pool>();
    return(
        <div>
            <h1>Pool {params.poolId}</h1>
            <h2>Members:</h2>
            <ol>
                { data.members.map((member: LeanUser) => {
                    return(
                        <li>{member.first_name + " " + member.last_name}</li>
                    );
                })}
            </ol>
            <div>
                <Outlet />
            </div>
        </div>
    )
}