import { Link, useLoaderData, json } from 'remix';
import { PoolModel } from '~/models/PoolSchema';

import type { Pool } from '~/models/PoolSchema';
import type { LoaderFunction } from 'remix';

export let loader: LoaderFunction = async () => {
    const pools = await PoolModel.find().lean();
    return json(pools)
}

export default function PoolsIndexRoute() {
    const poolData: Pool[] = useLoaderData();
    console.log(poolData);
    return(
        <div>
            <h1>Pools</h1>
            <p>You owe: $420</p>
            <ul>
                {poolData.map((poolDoc: Pool) => {
                    return(
                        <li><Link to={poolDoc._id}>{poolDoc._id}</Link></li>
                    )
                })}
            </ul>
        </div>
    )
}