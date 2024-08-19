"use client";
import React, { useEffect, useState } from "react";
import { search } from "@/lib/spotify";
import VoteBox from "@/components/Vote/VoteBox";
import { Track } from "@spotify/web-api-ts-sdk";
import { useSongClick } from "@/hooks/useSongClick";

type VoteBox = {
  song_id: string;
  image: string;
  title: string;
  artist: string;
};

type TableProps = {
  query: string;
  currentPage: number;
};

const VoteTable: React.FC<TableProps> = ({ query, currentPage }) => {
  const [results, setResults] = useState<VoteBox[]>([]);
  const { getSongClicks } = useSongClick();

  useEffect(() => {
    const fetchResults = async () => {
      if (query === "") {
        setResults([]);
        return;
      }
      const response = await search(query);
      const convertedResults = response!.tracks.items.map((track: Track) => ({
        title: track.name,
        artist: track.artists[0].name,
        image: track.album.images[0].url,
        song_id: track.id,
      }));

      setResults(convertedResults.slice(0, 16));
    };

    fetchResults();
  }, [query, currentPage]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
      {results.map((track: any, key: number) => (
        <VoteBox
          key={key}
          image={track.image}
          artist={track.artist}
          songName={track.title}
          song_id={track.song_id}
        />
      ))}
    </div>
  );
};
export default VoteTable;
