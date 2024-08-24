"use client";
import React, { useEffect, useState } from "react";
import { useSongClick } from "@/hooks/useSongClick";
import Image from "next/image";

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

  async function handleSearchClick() {
    try {
      newSongClick(props.song_id, props.image, props.songName, props.artist);
      props.onVote(props.song_id);
    } catch (error) {
      console.error("Error adding vote:", error);
    }
  }

  return (
    <div
      onClick={handleSearchClick}
      className="h-60 group overflow-hidden rounded-lg hover:shadow-lg active:shadow-2xl transition-all duration-300 hover:cursor-pointer"
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
      </div>
    </div>
  );
}

export default VoteBox;
