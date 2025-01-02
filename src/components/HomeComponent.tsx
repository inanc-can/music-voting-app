"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useSongVotes } from "@/hooks/useSongVotes";
import { duration, playSong } from "@/lib/spotify";
import { Table } from "@/components/Table";
import LogoutButton from "./LogOutButton";
import { CreatePartyDialog } from "./CreatePartyDialog";

export default function HomeComponent() {
  const { pickWinnerSong } = useSongVotes();
  const [party, setParty] = useState(false);

  const polling = useCallback(async () => {
    console.log("Party started");
    // Logic to pick a winner song
    const song = await pickWinnerSong();

    if (song) {
      const songDuration = await duration(song);

      // Play the song
      playSong(song);

      // Wait for the duration of the song before picking the next one
      setTimeout(polling, Number(songDuration));
    }
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
            <div className="gap-4 flex items-center">
              <CreatePartyDialog
                onCreateParty={(partyDetails) => console.log(partyDetails)}
              />
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      <Table />

      <div className="absolute bottom-24 left-0 right-0 flex justify-center">
        {!party && (
          <Button
            variant={"secondary"}
            onClick={() => {
              setParty(true);
            }}
          >
            Start the Party
          </Button>
        )}
        {party && (
          <Button
            variant={"secondary"}
            onClick={() => {
              setParty(false);
            }}
          >
            Stop the Party
          </Button>
        )}
      </div>
    </div>
  );
}
