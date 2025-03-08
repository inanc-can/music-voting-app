import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getSongData } from "@/lib/spotify";
type VoteBox = {
  song_id: string;
  image: string;
  title: string;
  artist: string;
};

export const useSongClick = () => {
  const [songClicks, setSongClicks] = useState<VoteBox[]>([]);

  const getSongClicks = async (partyId: string): Promise<VoteBox[]> => {
    const { data: votes, error } = await supabase
      .from("votesSongs")
      .select("song_id");

    if (!votes) {
      console.error("No votes found");
      return [];
    }

    const uniqueVotes = Array.from(
      new Set(votes.map((vote: { song_id: string }) => vote.song_id))
    ).map((song_id) => ({ song_id }));

    if (error) {
      console.error("Error fetching votes:", error);
      return [];
    }

    const songDataPromises = uniqueVotes.map(
      async (vote: { song_id: string }) => {
        const songData = await getSongData(vote.song_id);
        return {
          song_id: vote.song_id,
          image: songData.image,
          title: songData.title,
          artist: songData.artist,
        };
      }
    );

    const songData = await Promise.all(songDataPromises);
    setSongClicks(songData);
    return songData;
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

  const newSongClick = async (
    song_id: string,
    image: string,
    title: string,
    artist: string
  ) => {
    await addVote(song_id, null);
  };

  return { songClicks, getSongClicks, newSongClick };
};
