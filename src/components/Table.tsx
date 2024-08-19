"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSongClick } from "@/hooks/useSongClick";
import SongBox from "@/components/SongBox";
import { supabase } from "@/lib/supabase";

type VoteBox1 = {
  song_id: string;
  image: string;
  title: string;
  artist: string;
  votes?: number;
};

export function Table() {
  const { getSongClicks } = useSongClick();
  const [results, setResults] = useState<VoteBox1[]>([]);

  const fetchAndSortSongs = useCallback(async () => {
    const response = await getSongClicks();
    setResults(response);
  }, [getSongClicks]);

  useEffect(() => {
    fetchAndSortSongs();

    const voteChannel = supabase
      .channel("votes-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "votesSongs" },
        () => {
          console.log("Vote change detected in votesSongs");
          fetchAndSortSongs();
        }
      )
      .subscribe();

    const voteBoxChannel = supabase
      .channel("votebox-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "VoteBox" },
        () => {
          console.log("Change detected in VoteBox");
          fetchAndSortSongs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(voteChannel);
      supabase.removeChannel(voteBoxChannel);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
      {results.map((track: VoteBox1) => (
        <SongBox
          key={track.song_id}
          image={track.image}
          artist={track.artist}
          songName={track.title}
          song_id={track.song_id}
          votes={track.votes}
        />
      ))}
    </div>
  );
}

export default Table;
