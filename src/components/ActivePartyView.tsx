// components/ActivePartyView.tsx
"use client";

import { Button } from "@/components/ui/button";
import { playSong } from "@/lib/spotify";
import { useSongVotes } from "@/hooks/useSongVotes";

import { Table } from "@/components/Table";
type Song = {
  id: string;
  title: string;
  artist: string;
  votes: number;
};

type Member = {
  id: string;
  name: string;
  avatar?: string;
};

type Party = {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  members: Member[];
};

interface ActivePartyViewProps {
  party: Party;
  onLeaveParty: () => void;
}

export function ActivePartyView({ party, onLeaveParty }: ActivePartyViewProps) {
  const { pickWinnerSong } = useSongVotes();
  return (
    <div className="space-y-6">
      <div className="">
        <div className="bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {party.name}
              </h2>
            </div>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={onLeaveParty}
            >
              Delete Party
            </Button>
          </div>
        </div>
      </div>

      <Table />
      <div className="absolute bottom-24 left-0 right-0 flex justify-center">
        <Button
          onClick={async () => {
            const winnerSong = await pickWinnerSong();
            if (winnerSong) playSong(winnerSong);
          }}
        >
          Play the Most Popular Song
        </Button>
      </div>
    </div>
  );
}
