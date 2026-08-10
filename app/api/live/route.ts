import { getLiveLedger } from "@/lib/live";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getLiveLedger();
  return Response.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
