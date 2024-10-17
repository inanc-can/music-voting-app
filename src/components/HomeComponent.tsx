"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useSongVotes } from "@/hooks/useSongVotes";
import { duration, playSong } from "@/lib/spotify";
import { Table } from "@/components/Table";
import LogoutButton from "./LogOutButton";

export default function HomeComponent() {
  const { pickWinnerSong } = useSongVotes();
  const [party, setParty] = useState(false);

  const polling = useCallback(async () => {
    console.log("Party started");
    // Logic to pick a winner song
    const song = await pickWinnerSong();
    console.log("Winner song:", song);
    if (song) {
      const songDuration = await duration(song);
      console.log(Number(songDuration));
      try {
        const response = await fetch("/api/spotify/search", {
          method: "POST",
          body: JSON.stringify({ song }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
        } else {
          console.error("Failed to play the song ");
        }
      } catch (error) {
        console.error("An error while playing the song", error);
      }
    }
    // Logic to wait for the duration of the song
  }, [pickWinnerSong]);

  useEffect(() => {
    if (party) {
      polling();
    }
  }, [party, polling]);

  return (
    <div className="space-y-6">
      <div className="">
        <div className="bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                BBQ Party
              </h2>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      <Table />

      <div className="absolute bottom-24 left-0 right-0 flex justify-center">
        <div></div>
        <Button
          variant={"secondary"}
          onClick={() => {
            setParty(true);
          }}
        >
          Start the Party
        </Button>
      </div>
    </div>
  );
}
