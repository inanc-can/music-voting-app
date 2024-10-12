import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function sendVote(
  songId: string,
  userId: string,
  image: string,
  title: string,
  artist: string
) {
  try {
    // Check if the song exists in the VoteBox
    const { data: voteBoxData, error: voteBoxError } = await supabase
      .from("VoteBox")
      .select("*")
      .eq("song_id", songId)
      .single();

    if (voteBoxError && voteBoxError.code !== "PGRST116") {
      throw voteBoxError;
    }

    // If the song is not found in the VoteBox, add it
    if (!voteBoxData) {
      const { error: insertVoteBoxError } = await supabase
        .from("VoteBox")
        .insert({ songId, userId, image, title, artist });

      if (insertVoteBoxError) {
        throw insertVoteBoxError;
      }
    }

    // Insert the vote into the votesSongs table
    const { error: insertVoteError } = await supabase
      .from("votesSongs")
      .insert({ song_id: songId, user_id: userId });

    if (insertVoteError) {
      throw insertVoteError;
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending vote:", error);
    return { success: false, error };
  }
}
