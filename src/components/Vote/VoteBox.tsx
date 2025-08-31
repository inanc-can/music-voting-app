"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getSongsVotes } from "@/lib/song";

interface VoteBoxProps {
  image: string;
  artist: string;
  songName: string;
  song_id: string;
  partyId: string;
  onVote?: (song_id: string) => void;
  votes: number;
}

export function VoteBox(props: VoteBoxProps) {
  const [songsVotes, setSongsVotes] = useState(props.votes);
  const [loading, setLoading] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const [animationBoxClass, setAnimationBoxClass] = useState("");
  const [isVotedByUser, setIsVotedByUser] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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
      const votes = await getSongsVotes(props.song_id, props.partyId);
      setSongsVotes(votes || 0);
    };
    fetchVotes();

    // Determine if current user has voted for this song in this party
    const initUserVote = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
        if (!user) {
          setIsVotedByUser(false);
          return;
        }
        const { data, error } = await supabase
          .from("votesSongs")
          .select("song_id, partyId, user_id")
          .eq("user_id", user.id)
          .eq("partyId", props.partyId)
          .limit(1)
          .maybeSingle?.()!;

        // maybeSingle may not exist in some clients; fallback handled below
        const row = (data as any) || null;
        if (row && row.song_id === props.song_id) {
          setIsVotedByUser(true);
        } else {
          setIsVotedByUser(false);
        }
      } catch (e) {
        // Fallback for clients without maybeSingle
        try {
          const {
            data: rows,
          } = await supabase
            .from("votesSongs")
            .select("song_id, partyId, user_id")
            .eq("user_id", currentUserId || "")
            .eq("partyId", props.partyId)
            .limit(1);
          const row = rows && rows[0];
          setIsVotedByUser(!!row && row.song_id === props.song_id);
        } catch (_) {
          setIsVotedByUser(false);
        }
      }
    };
    initUserVote();

    const channel = supabase
      .channel(`song-votes-${props.song_id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votesSongs",
        },
        async (payload) => {
          getSongsVotes(props.song_id, props.partyId).then((votes) =>
            setSongsVotes(votes || 0)
          );

          // Update user-specific highlight
          const newRow: any = (payload as any).new;
          const oldRow: any = (payload as any).old;
          const affectedUserId = newRow?.user_id || oldRow?.user_id;
          const affectedPartyId = newRow?.partyId ?? oldRow?.partyId;
          if (!currentUserId || affectedUserId !== currentUserId) return;
          if (String(affectedPartyId) !== String(props.partyId)) return;

          // If the new row belongs to this song, highlight; if the old row belonged to this song and it's deleted/changed, unhighlight
          const newSongId = newRow?.song_id;
          const oldSongId = oldRow?.song_id;
          if (newSongId === props.song_id) {
            setIsVotedByUser(true);
          } else if (oldSongId === props.song_id) {
            setIsVotedByUser(false);
          }
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
          partyId: props.partyId,
        }),
      });

      if (!response.ok) {
        console.log(response);
        toast("Failed to add vote");
      } else {
        const result = await response.json();
        toast(result.message?.toString() || "Vote added successfully");
  // Optimistic highlight
  setIsVotedByUser(true);
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
      className={`h-60 group overflow-hidden rounded-lg hover:shadow-lg active:shadow-2xl active:brightness-110 transition-all duration-300 hover:cursor-pointer text-white ${animationBoxClass} ${
      isVotedByUser ? "border border-emerald-400/60 bg-emerald-500/5" : "border border-transparent"
      }`}
    >
      <div className="w-48 h-48 relative p-8 hover:cursor-pointer">
      {isVotedByUser && (
        <span
        className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-emerald-600/80 text-white text-[10px] font-medium px-2 py-0.5"
        aria-label="You voted for this song"
        >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-3 h-3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12.5l4 4L19 7.5" />
        </svg>
        Your vote
        </span>
      )}
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
        className={`w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300 ${
        isVotedByUser ? "ring-2 ring-emerald-400/40" : ""
        }`}
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
