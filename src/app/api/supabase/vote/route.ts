import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { user_id, song_id, image, title, artist } = await req.json();
    const voteResult = await addVote(song_id, user_id);
    if (!voteResult.success) {
      return NextResponse.json({ error: voteResult.message }, { status: 500 });
    }

    const voteBoxResult = await addVoteBox(song_id, image, title, artist);
    if (!voteBoxResult.success) {
      return NextResponse.json(
        { error: voteBoxResult.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Vote and VoteBox updated successfully" },
      { status: 200 }
    );
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
    .eq("song_id", song_id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is the code for no rows found
    console.error("Error fetching existing vote:", fetchError);
    return { success: false, message: "Error fetching existing vote" };
  }

  // If a vote exists, delete the previous vote
  if (existingVote) {
    const { error: deleteError } = await supabase
      .from("votesSongs")
      .delete()
      .eq("user_id", user_id)
      .eq("song_id", song_id);

    if (deleteError) {
      console.error("Error deleting existing vote:", deleteError);
      return { success: false, message: "Error deleting existing vote" };
    }
  }

  // Insert the new vote
  const { error: insertError } = await supabase.from("votesSongs").insert({
    user_id,
    song_id,
  });

  if (insertError) {
    console.error("Error adding vote:", insertError);
    return { success: false, message: "Error adding vote" };
  }

  return { success: true, message: "Vote added successfully" };
};

const addVoteBox = async (
  song_id: string,
  image: string,
  title: string,
  artist: string
) => {
  // Check if the song is already in VoteBox
  const { error: fetchError } = await supabase
    .from("VoteBox")
    .select("*")
    .eq("song_id", song_id)
    .single();

  // If the song exists, return
  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is the code for no rows found
    console.error("Error fetching existing song:", fetchError);
    return { success: false, message: "Error fetching existing song" };
  }

  // Insert the new song into VoteBox
  const { error: insertError } = await supabase.from("VoteBox").insert({
    image,
    title,
    artist,
    song_id,
  });

  if (insertError) {
    console.error("Error adding song to VoteBox:", insertError);
    return { success: false, message: "Error adding song to VoteBox" };
  }

  return { success: true, message: "Song added to VoteBox" };
};
