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
  searchMode?: "spotify" | "party"; // Add search mode prop
  onLoadingChange?: (loading: boolean) => void; // Add loading callback
};

const VoteTable: React.FC<VoteTableProps> = ({
  query,
  currentPage,
  partyId,
  searchMode = "spotify", // Default to spotify search
  onLoadingChange,
}) => {
  const [results, setResults] = useState<VoteBox[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getSongClicks } = useSongClick(); // Add this line

  // Helper function to update loading state
  const updateLoadingState = (loading: boolean) => {
    setIsLoading(loading);
    onLoadingChange?.(loading);
  };

  useEffect(() => {
    const fetchResults = async () => {
      // Set loading only when there's a meaningful search happening
      const shouldShowLoading = (searchMode === "spotify" && query !== "") || 
                               (searchMode === "party" && query !== "");
      
      if (shouldShowLoading) {
        updateLoadingState(true);
      }

      // If searchMode is "party", always show party songs
      if (searchMode === "party") {
        const topVotedSongs = await getSongClicks(partyId);
        let convertedResults = await Promise.all(
          topVotedSongs.map(async (track: any) => ({
            song_id: track.song_id,
            image: track.image,
            title: track.title,
            artist: track.artist,
            votes: await getSongsVotes(track.song_id, partyId),
          }))
        );

        // Filter by query if there's a search term
        if (query !== "") {
          convertedResults = convertedResults.filter(
            (song) =>
              song.title.toLowerCase().includes(query.toLowerCase()) ||
              song.artist.toLowerCase().includes(query.toLowerCase())
          );
        }

        const sortedResults = convertedResults.sort(
          (a, b) => (b.votes || 0) - (a.votes || 0)
        );
        setResults(sortedResults.slice(0, 16));
        updateLoadingState(false);
        return;
      }

      // Original spotify search logic
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
        updateLoadingState(false);
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
          updateLoadingState(false);
        } else {
          console.error("Failed to fetch search results");
          updateLoadingState(false);
        }
      } catch (error) {
        console.error("An error occurred while searching", error);
        updateLoadingState(false);
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
  }, [query, currentPage, searchMode, partyId]);

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center`}
    >
      {isLoading ? (
        // Show skeleton loaders while searching
        Array.from({ length: 8 }).map((_, index) => (
          <VoteBoxSkeleton key={`skeleton-${index}`} />
        ))
      ) : (
        results.map((track: any, key: number) => (
          <Suspense fallback={<VoteBoxSkeleton />} key={key}>
            <VoteBox
              key={key}
              image={track.image}
              artist={track.artist}
              songName={track.title}
              song_id={track.song_id}
              votes={track.votes}
              partyId={partyId}
            />
          </Suspense>
        ))
      )}
    </div>
  );
};
export default VoteTable;
