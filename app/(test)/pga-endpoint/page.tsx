import { getLeaderboard } from "@/lib/pga-endpoints/getTournament";

export default async function PgaEndpointPage() {
    const data = await getLeaderboard();
    return <div>{JSON.stringify(data)}</div>
};