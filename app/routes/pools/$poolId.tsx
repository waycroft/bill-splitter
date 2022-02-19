import { useParams } from 'remix';

export default function PoolRoute() {
    const params = useParams();
    return(
        <p>Pool {params.poolId}</p>
    )
}