import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type VoteBox = {
  song_id: string;
  image: string;
  title: string;
  artist: string;
};

export const useSongClick = () => {
  const [songClicks, setSongClicks] = useState<VoteBox[]>([]);

  const getSongClicks = async (): Promise<VoteBox[]> => {
    let { data, error } = await supabase.rpc("get_votebox_sorted");
    if (error) console.error(error);

    return data || [];
  };

  const getTemporaryUserId = () => {
    let userId = localStorage.getItem("temporary_user_id");
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem("temporary_user_id", userId);
    }
    return userId;
  };

  const addVote = async (song_id: string, user_id: string | null) => {
    if (!user_id) {
      user_id = getTemporaryUserId();
    }

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

  const addVotebox = async (
    song_id: string,
    image: string,
    title: string,
    artist: string
  ) => {
    const { data: existingSong, error: fetchError } = await supabase
      .from("VoteBox")
      .select("*")
      .eq("song_id", song_id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is the code for no rows found
      console.error("Error fetching existing song:", fetchError);
      return;
    }

    if (!existingSong) {
      const { data, error } = await supabase.from("VoteBox").insert({
        song_id,
        image,
        title,
        artist,
      });

      if (error) {
        console.error("Error adding song to VoteBox:", error);
      }
    }
  };

  const newSongClick = async (
    song_id: string,
    image: string,
    title: string,
    artist: string
  ) => {
    await addVote(song_id, null);
    await addVotebox(song_id, image, title, artist);
  };

  return { songClicks, getSongClicks, newSongClick };
};
