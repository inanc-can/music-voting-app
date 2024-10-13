"use client";
import React, { useEffect, useState } from "react";
import { useSongClick } from "@/hooks/useSongClick";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface VoteBoxProps {
  image: string;
  artist: string;
  songName: string;
  song_id: string;
  onVote: (song_id: string) => void;
  votes: number;
}

export function VoteBox(props: VoteBoxProps) {
  const { newSongClick } = useSongClick();
  const [songsVotes, setSongsVotes] = useState(props.votes);
  const [loading, setLoading] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const [animationBoxClass, setAnimationBoxClass] = useState("");

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
    setAnimationClass("animate-slideIn");
    const timeout = setTimeout(() => setAnimationClass(""), 1000); // Remove animation class after 1 second
    return () => clearTimeout(timeout);
  }, [songsVotes]);

  useEffect(() => {
    // Set animation class on mount
    setAnimationBoxClass("animate-switchPlace");

    // Set timeout to remove animation class after 1 second
    const timeout = setTimeout(() => setAnimationBoxClass(""), 1000);

    // Cleanup function to clear timeout on unmount
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchVotes = async () => {
      const votes = await getSongsVotes(props.song_id);
      setSongsVotes(votes || 0);
    };
    fetchVotes();

    const channel = supabase
      .channel(`song-votes-${props.song_id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votesSongs",
        },
        (payload) => {
          getSongsVotes(props.song_id).then((votes) =>
            setSongsVotes(votes || 0)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [props.song_id]);

  async function handleSearchClick() {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const response = await fetch("/api/supabase/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          song_id: props.song_id,
          image: props.image,
          title: props.songName,
          artist: props.artist,
        }),
      });

      if (!response.ok) {
        console.log(response);
        toast("Failed to add vote");
      } else {
        toast("Vote added successfully");
      }
    } catch (error) {
      console.error("Error adding vote:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      onClick={handleSearchClick}
      className={`h-60 group overflow-hidden rounded-lg hover:shadow-lg active:shadow-2xl active:brightness-110 transition-all duration-300 hover:cursor-pointer text-white ${animationBoxClass}`}
    >
      <div className="w-48 h-48 relative p-8 hover:cursor-pointer">
        <div
          className={`absolute top-2 right-2 rounded-full text-md px-2 py-1 font-semibold ${animationClass}`}
        >
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
          <p className="text-sm font-semibold">{props.songName}</p>
          <p className="text-xs">{props.artist}</p>
        </div>
      </div>
    </div>
  );
}

export default VoteBox;
