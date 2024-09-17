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
    addVote(song_id, null);

    const { data, error } = await supabase.from("VoteBox").insert({
      song_id,
      image,
      title,
      artist,
    });

    return data;
  };

  return { songClicks, getSongClicks, newSongClick };
};
