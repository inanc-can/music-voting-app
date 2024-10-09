import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Initialize Supabase client for server-side
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

type VoteBox = {
  song_id: string;
  image: string;
  title: string;
  artist: string;
};

export async function POST(req: NextRequest) {
  try {
    const { song_id, image, title, artist } = await req.json();

    if (!song_id) {
      return NextResponse.json(
        { error: "song_id is required" },
        { status: 400 }
      );
    }

    const userId = uuidv4();

    // Check if the user has already voted for this song
    const { data: existingVote, error: fetchError } = await supabase
      .from("votesSongs")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error(fetchError);
      return NextResponse.json(
        { error: "Error fetching existing vote" },
        { status: 500 }
      );
    }

    if (existingVote) {
      return NextResponse.json(
        { message: "User has already voted for this song." },
        { status: 200 }
      );
    }

    // Check if the song exists in the VoteBox table
    const { data: existingSong, error: songFetchError } = await supabase
      .from("VoteBox")
      .select("*")
      .eq("song_id", song_id)
      .single();

    if (songFetchError) {
      console.error(songFetchError);
      return NextResponse.json(
        { error: "Error fetching song from VoteBox" },
        { status: 500 }
      );
    }

    // If the song does not exist in the VoteBox table, add it
    if (!existingSong) {
      const { error: songInsertError } = await supabase.from("VoteBox").insert([
        {
          song_id,
          image,
          title,
          artist,
        },
      ]);

      if (songInsertError) {
        console.error(songInsertError);
        return NextResponse.json(
          { error: "Error adding song to VoteBox" },
          { status: 500 }
        );
      }
    }

    // Add the vote
    const { error: insertError } = await supabase
      .from("votes")
      .insert([{ song_id, user_id: userId }]);

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: "Error adding vote" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Vote added successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
