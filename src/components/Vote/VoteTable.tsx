"use client";
import React, { Suspense, useEffect, useState, useRef } from "react";
const VoteBox = React.lazy(() => import("./VoteBox")); // Dynamically import VoteBox
import { supabase } from "@/lib/supabase";
import { useSongClick } from "@/hooks/useSongClick"; // Add this import
import { VoteBoxSkeleton } from "../skeletons/VoteBoxSkeleton";
import { getSongsVotes } from "@/lib/song";

type VoteBox = {
  song_id: string;
  image: string;
  title: string;
  artist: string;
  votes?: number;
};

type VoteTableProps = {
  query: string;
  currentPage: number;
  partyId: string;
};

const VoteTable: React.FC<VoteTableProps> = ({
  query,
  currentPage,
  partyId,
}) => {
  const [results, setResults] = useState<VoteBox[]>([]);
  const { getSongClicks } = useSongClick(); // Add this line

  useEffect(() => {
    const fetchResults = async () => {
      if (query === "") {
        const topVotedSongs = await getSongClicks(partyId);
        const convertedResults = await Promise.all(
          topVotedSongs.map(async (track: any) => ({
            song_id: track.song_id,
            image: track.image,
            title: track.title,
            artist: track.artist,
            votes: await getSongsVotes(track.song_id, partyId),
          }))
        );
        const sortedResults = convertedResults.sort(
          (a, b) => (b.votes || 0) - (a.votes || 0)
        );
        setResults(sortedResults.slice(0, 16));
        return;
      }
      try {
        const response = await fetch("/api/spotify/search", {
          method: "POST",
          body: JSON.stringify({ searchTerm: query }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const convertedResults = await Promise.all(
            data.map(async (track: any) => ({
              song_id: track.song_id,
              image: track.image,
              title: track.title,
              artist: track.artist,
              votes: await getSongsVotes(track.song_id, partyId),
            }))
          );
          const sortedResults = convertedResults.sort(
            (a, b) => (b.votes || 0) - (a.votes || 0)
          );

          setResults(sortedResults.slice(0, 16));
        } else {
          console.error("Failed to fetch search results");
        }
      } catch (error) {
        console.error("An error occurred while searching", error);
      }
    };

    fetchResults();

    const voteChannel = supabase
      .channel("votes-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "votesSongs" },
        () => {
          fetchResults();
        }
      )
      .subscribe((status) => {
        console.log("Channel status:", status);
      });

    return () => {
      if (voteChannel) {
        supabase.removeChannel(voteChannel);
      }
    };
  }, [query, currentPage]);

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center`}
    >
      {results.map((track: any, key: number) => (
        <Suspense fallback={<VoteBoxSkeleton />} key={key}>
          <VoteBox
            key={key}
            image={track.image}
            artist={track.artist}
            songName={track.title}
            song_id={track.song_id}
            votes={track.votes}
            partyId={partyId}
            onVote={() => {}} // Pass an empty function to satisfy the prop requirement
          />
        </Suspense>
      ))}
    </div>
  );
};
export default VoteTable;
