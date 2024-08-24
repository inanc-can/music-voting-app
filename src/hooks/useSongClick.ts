import { supabase } from "@/lib/supabase";
import { useState } from "react";

type VoteBox = {
  song_id: string;
  image: string;
  title: string;
  artist: string;
};

export const useSongClick = () => {
  const [songClicks, setSongClicks] = useState<VoteBox[]>([]);

  const getSongClicks = async (): Promise<VoteBox[]> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.log("You are not authenticated");
      return [];
    }

    const {
      user: { id },
    } = session;

    let { data, error } = await supabase.rpc("get_votebox_sorted");
    if (error) console.error(error);

    return data || [];
  };

  const addVote = async (song_id: string, user_id: string) => {
    const { data, error } = await supabase.from("votesSongs").insert({
      song_id,
      user_id: user_id,
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
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return console.log("You are not authenticated");

    const {
      user: { id },
    } = session;

    addVote(song_id, id);

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
