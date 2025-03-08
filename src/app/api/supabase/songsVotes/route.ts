import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const songId = searchParams.get("songId");
  const partyId = searchParams.get("partyId");

  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase
    .from("votesSongs")
    .select("song_id")
    .eq("song_id", songId)
    .eq("party_id", partyId);

  return Response.json({ votes: data?.length || 0 });
}
