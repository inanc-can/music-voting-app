"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { playSong } from "@/lib/spotify";
import { addQueue } from "@/lib/spotify";
import Image from "next/image";
import { getSongsVotes } from "@/lib/song";

interface SongBoxProps {
  song_id: string;
  image: string;
  artist: string;
  songName: string;
  votes?: number;
  partyId: string;
}

export function SongBox(props: SongBoxProps) {
  const [songsVotes, setSongsVotes] = useState(0);

  const handleClick = async (event: { clientX: any; currentTarget: any }) => {
    const { clientX, currentTarget } = event;
    const { left, width } = currentTarget.getBoundingClientRect();
    const clickPosition = clientX - left;

    try {
      if (clickPosition < width / 2) {
        await playSong(props.song_id);
      } else {
        await addQueue(props.song_id);
      }
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  useEffect(() => {
    const fetchVotes = async () => {
      const votes = await getSongsVotes(props.song_id, props.partyId);
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
    <div
      onClick={handleClick}
      className="h-60 group overflow-hidden rounded-lg hover:shadow-lg active:shadow-2xl transition-all duration-300 hover:cursor-pointer text-white"
    >
      <div className="w-48 h-48 relative p-8 hover:cursor-pointer">
        <div className="absolute top-2 right-2 rounded-full text-md px-2 py-1 font-semibold">
          {songsVotes}
        </div>
        <Image
          src={props.image}
          alt="Song Cover"
          width={256}
          height={256}
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
        <div className="mt-4 text-center">
          <p className="text-base font-semibold">{props.songName}</p>
          <p className="text-sm">{props.artist}</p>
        </div>
      </div>
    </div>
  );
}

export default SongBox;
