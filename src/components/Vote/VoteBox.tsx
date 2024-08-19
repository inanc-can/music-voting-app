"use client";
import React, { useEffect } from "react";
import { useSongClick } from "@/hooks/useSongClick";

interface VoteBoxProps {
  image: string;
  artist: string;
  songName: string;
  song_id: string;
}

export function VoteBox(props: VoteBoxProps) {
  const { newSongClick } = useSongClick();

  async function handleSearchClick() {
    try {
      newSongClick(props.song_id, props.image, props.songName, props.artist);
    } catch (error) {
      console.error("Error adding vote:", error);
    }
  }

  return (
    <div onClick={handleSearchClick} className="">
      <div className="w-48 h-48 relative p-8">
        <img
          src={props.image}
          alt="Song Cover"
          className="w-full h-full object-cover rounded-lg"
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
