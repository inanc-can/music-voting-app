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
    return NextResponse.json(
      { error: "Failed to fetch existing vote" },
      { status: 500 }
    );
  }

  // If a vote exists, delete the previous vote
  if (existingVote) {
    const { error: deleteError } = await supabase
      .from("votesSongs")
      .delete()
      .eq("user_id", user_id);

    if (deleteError) {
      console.error("Error deleting existing vote:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete existing vote" },
        { status: 500 }
      );
    }
  }

  // Insert the new vote
  const { data, error } = await supabase.from("votesSongs").insert({
    song_id,
    user_id,
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to insert new vote" },
      { status: 500 }
    );
  }
};

const addVoteBox = async (
  song_id: string,
  image: string,
  title: string,
  artist: string
) => {
  // Check if the song is already in VoteBox
  const { data: existingSong, error: fetchError } = await supabase
    .from("VoteBox")
    .select("*")
    .eq("song_id", song_id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is the code for no rows found
    return NextResponse.json(
      { error: "Failed to fetch existing song" },
      { status: 500 }
    );
  }

  // If the song exists, return
  if (existingSong) {
    return NextResponse.json(
      { error: "Song already exists in VoteBox" },
      { status: 400 }
    );
  }

  // Insert the new song into VoteBox
  const { error } = await supabase.from("VoteBox").insert({
    image,
    title,
    artist,
    song_id,
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to insert new song into VoteBox" },
      { status: 500 }
    );
  }
};
