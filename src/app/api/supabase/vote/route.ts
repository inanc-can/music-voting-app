import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { user_id, song_id, image, title, artist } = await req.json();
    await addVote(song_id, user_id);
    await addVoteBox(song_id, image, title, artist);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

const addVote = async (song_id: string, user_id: string) => {
  // Check if the user has already voted for this song
  const { data: existingVote, error: fetchError } = await supabase
    .from("votesSongs")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is the code for no rows found
    console.error("Error fetching existing vote:", fetchError);
    return;
  }

  // If a vote exists, delete the previous vote
  if (existingVote) {
    const { error: deleteError } = await supabase
      .from("votesSongs")
      .delete()
      .eq("user_id", user_id);

    if (deleteError) {
      console.error("Error deleting existing vote:", deleteError);
      return;
    }
  }

  // Insert the new vote
  const { data, error } = await supabase.from("votesSongs").insert({
    song_id,
    user_id,
  });

  if (error) {
    console.error("Error adding vote:", error);
  }
};

const addVoteBox = async (
  song_id: string,
  image: string,
  title: string,
  artist: string
) => {
  // Insert the new song into VoteBox
  const { data, error } = await supabase.from("VoteBox").insert({
    image,
    title,
    artist,
    song_id,
  });

  if (error) {
    console.error("Error adding song to VoteBox:", error);
  }
};
