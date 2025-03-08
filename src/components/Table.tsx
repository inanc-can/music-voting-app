"use client";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSongClick } from "@/hooks/useSongClick";
import SongBox from "@/components/SongBox";
import { supabase } from "@/lib/supabase";
import { VoteBoxSkeleton } from "./skeletons/VoteBoxSkeleton";

type VoteBox = {
  song_id: string;
  image: string;
  title: string;
  artist: string;
  votes?: number;
};

type TableProps = {
  partyId: string;
};

const Table: React.FC<TableProps> = ({ partyId }) => {
  const { getSongClicks } = useSongClick();
  const [results, setResults] = useState<VoteBox[]>([]);

  const fetchAndSortSongs = useCallback(async () => {
    const response = await getSongClicks(partyId);
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
          fetchAndSortSongs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(voteChannel);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center p-8">
      {results.map((track: VoteBox) => (
        <Suspense fallback={<VoteBoxSkeleton />} key={track.song_id}>
          <SongBox
            key={track.song_id}
            image={track.image}
            artist={track.artist}
            songName={track.title}
            song_id={track.song_id}
            votes={track.votes}
          />
        </Suspense>
      ))}
    </div>
  );
};

export default Table;
