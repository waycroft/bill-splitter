import { Outlet } from "remix";

export default function PoolsRoute() {
    return(
        <div>
            <h1>Pools</h1>
            <p>You owe: $420</p>
            <Outlet />
        </div>
    )
}