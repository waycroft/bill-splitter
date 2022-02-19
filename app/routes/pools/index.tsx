import { Link } from 'remix';

export default function PoolsIndexRoute() {
    const pools = ["A", "B", "C", "D"]
    return(
        <div>
            <ul>
                <li><Link to={pools[0]}>Pool A</Link></li>
                <li><Link to={pools[1]}>Pool B</Link></li>
                <li><Link to={pools[2]}>Pool C</Link></li>
                <li><Link to={pools[3]}>Pool D</Link></li>
            </ul>
        </div>
    )
}