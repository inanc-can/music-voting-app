"use client";
import React, { useEffect, useState } from "react";
import { search } from "@/lib/spotify";
import VoteBox from "@/components/Vote/VoteBox";
import { Track } from "@spotify/web-api-ts-sdk";
import { supabase } from "@/lib/supabase";
import { useSongClick } from "@/hooks/useSongClick"; // Add this import

type VoteBox = {
  song_id: string;
  image: string;
  title: string;
  artist: string;
  votes?: number;
};

type TableProps = {
  query: string;
  currentPage: number;
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

const VoteTable: React.FC<TableProps> = ({ query, currentPage }) => {
  const [results, setResults] = useState<VoteBox[]>([]);
  const { getSongClicks } = useSongClick(); // Add this line

  useEffect(() => {
    const fetchResults = async () => {
      if (query === "") {
        const topVotedSongs = await getSongClicks();
        setResults(topVotedSongs.slice(0, 16));
        return;
      }
      const response = await search(query);
      const convertedResults = await Promise.all(
        response!.tracks.items.map(async (track: Track) => ({
          title: track.name,
          artist: track.artists[0].name,
          image: track.album.images[0].url,
          song_id: track.id,
          votes: await getSongsVotes(track.id),
        }))
      );
      setResults(convertedResults.slice(0, 16));
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
      .subscribe();

    return () => {
      supabase.removeChannel(voteChannel);
    };
  }, [query, currentPage, useSongClick]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center transition-all duration-300">
      {results.map((track: any, key: number) => (
        <VoteBox
          key={key}
          image={track.image}
          artist={track.artist}
          songName={track.title}
          song_id={track.song_id}
          votes={track.votes}
          onVote={() => {}} // Pass an empty function to satisfy the prop requirement
        />
      ))}
    </div>
  );
};
export default VoteTable;
