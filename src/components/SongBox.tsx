"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { playSong } from "@/lib/spotify";
import { addQueue } from "@/lib/spotify";
import { Badge } from "./ui/badge";
import Image from "next/image";
interface SongBoxProps {
  song_id: string;
  image: string;
  artist: string;
  songName: string;
  votes?: number;
}

export function SongBox(props: SongBoxProps) {
  const [songsVotes, setSongsVotes] = useState(0);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [messageOpacity, setMessageOpacity] = useState(0);

  const handleClick = (event: { clientX: any; currentTarget: any }) => {
    const { clientX, currentTarget } = event;
    const { left, width } = currentTarget.getBoundingClientRect();
    const clickPosition = clientX - left;

    if (clickPosition < width / 2) {
      playSong(props.song_id);
      setMessage("Song is Played");

      // Perform action for left half click
    } else {
      addQueue(props.song_id);
      setMessage("Added to Queue");

      // Perform action for right half click
    }
    setShowMessage(true);
    setMessageOpacity(1);

    setTimeout(() => {
      setMessageOpacity(0);
      setTimeout(() => setShowMessage(false), 1000); // Hide message after fade out
    }, 1000); // Fade out after 1 second
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
          {props.votes}
        </div>
        <Image
          src={props.image}
          alt="Song Cover"
          width={256}
          height={256}
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
        />
        <div className="mt-4 text-center">
          <p className="text-sm font-semibold">{props.songName}</p>
          <p className="text-xs">{props.artist}</p>
        </div>
        {showMessage && (
          <div
            className="absolute top-1/2 transform transition-opacity duration-1000"
            style={{ opacity: messageOpacity }}
          >
            <Badge variant="secondary" className="py-2 px-6 ">
              Vote Added!
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

export default SongBox;
