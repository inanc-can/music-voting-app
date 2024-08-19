"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { playSong } from "@/lib/spotify";

interface SongBoxProps {
  song_id: string;
  image: string;
  artist: string;
  songName: string;
  votes?: number;
}

export function SongBox(props: SongBoxProps) {
  const [songsVotes, setSongsVotes] = useState(0);
  const handleSearchClick = () => {
    playSong(props.song_id);
  };
  async function getSongsVotes(song_id: string) {
    try {
      const { data, error } = await supabase
        .from("votesSongs")
        .select("song_id")
        .eq("song_id", song_id);

      if (data) {
        return data.length;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    const fetchVotes = async () => {
      const votes = await getSongsVotes(props.song_id);
      setSongsVotes(votes || 0);
    };
    fetchVotes();

    // Set up the real-time subscription
    const channel = supabase
      .channel(`song-votes-${props.song_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "votesSongs",
          filter: `song_id=eq.${props.song_id}`,
        },
        (payload) => {
          console.log("New vote added:", payload);
          setSongsVotes((prevVotes) => prevVotes + 1);
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [props.song_id]);

  return (
    <div onClick={handleSearchClick}>
      <div className="w-48 h-48 relative p-8">
        <div className="absolute top-2 right-2 rounded-full text-md px-2 py-1 font-semibold">
          {songsVotes}
        </div>
        <img
          src={props.image}
          alt="Song Cover"
          className="w-full h-full object-cover rounded-lg hover:scale-105 "
        />
        <div className="mt-4 text-center">
          <p className="text-sm font-semibold">{props.songName}</p>
          <p className="text-xs">{props.artist}</p>
        </div>
      </div>
    </div>
  );
}

export default SongBox;
