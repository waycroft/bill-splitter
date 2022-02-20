import { Link, useLoaderData, json } from 'remix';
import { PoolModel } from '~/models/PoolSchema';
import { LeanUser } from '~/models/UserSchema';
import { getPools } from '~/utils/pool.actions';

import type { Pool } from '~/models/PoolSchema';
import type { LoaderFunction } from 'remix';

export let loader: LoaderFunction = async () => {
    return json(await getPools());
}

export default function PoolsIndexRoute() {
    const poolData: Pool[] = useLoaderData();
    return(
        <div>
            <div>
                <h1>Pools</h1>
                <p>You owe: $420</p>
            </div>
            <div>
                <button className='btn'><Link to="new">Create Pool</Link></button>
            </div>
            <hr />
            <div>
                <table>
                    { poolData.map((pool: Pool) => {
                        return (
                        <tr>
                            <td><Link to={pool._id}>{pool._id}</Link></td>
                            <td>Members: 
                                <ul>
                                    { pool.members.map((user: LeanUser) => {
                                        return (<li>{ user.first_name + " " + user.last_name }</li>)
                                    })}
                                </ul>
                            </td>
                        </tr>)
                    })}
                </table>
            </div>
        </div>
    )
}