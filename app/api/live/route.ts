import { getLiveLedger } from "@/lib/live";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getLiveLedger();
  return Response.json(data, {
    headers: {
      "Cache-Control": "private, no-store, no-cache, max-age=0, must-revalidate",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
    },
  });
}
