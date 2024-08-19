"use client";
import { useState, useEffect } from "react";
import { getTrack, playSong } from "@/lib/spotify";
import { Track } from "@spotify/web-api-ts-sdk";
import { supabase } from "@/lib/supabase";

export default function PlayBox() {
  const [song, setSong] = useState<Track>();
  const [winnerSong, setWinnerSong] = useState<Track>();

  async function pickWinnerSong(): Promise<Track | undefined> {
    try {
      const { data, error } = await supabase
        .from("votesSongs")
        .select("song_id");

      if (data) {
        const counts = data.reduce(
          (acc: { [x: string]: any }, val: { song_id: string | number }) => {
            acc[val.song_id] = (acc[val.song_id] || 0) + 1;
            return acc;
          },
          {}
        );

        const mostCommonSongId = Object.keys(counts).reduce((a, b) =>
          counts[a] > counts[b] ? a : b
        );

        return getTrack(mostCommonSongId);
      }
    } catch (error) {
      throw error;
    }
  }

  const fetchRecentVote = async () => {
    const song = await pickWinnerSong();
    setWinnerSong(song);
    playSong(song!.id);
  };

  if (song === undefined) {
    <div
      className="p-4 rounded-2xl bg-red-500 text-white"
      onClick={fetchRecentVote}
    >
      Fetch Winner Song
    </div>;
    return (
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center rounded-2xl 2xl:max-w-80 bg-gray-900 p-4">
        <h1 className="text-white font-semibold">No Vote is Given</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-white font-semibold">Your Vote</h1>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center rounded-2xl 2xl:max-w-80 bg-gray-900 p-4">
        <img
          src={song?.album.images[0].url}
          alt="Song Cover"
          className="size-24 rounded-full"
        />
        <div className="flex-col px-4">
          <h1 className="text-white font-semibold">{song.name}</h1>
          <h2 className="text-gray-400">{song.artists[0].name}</h2>
        </div>
      </div>
    </div>
  );
}
