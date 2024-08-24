// components/ActivePartyView.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  return (
    <div className="space-y-6">
      <div className="">
        <div className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {party.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {party.description}
              </p>
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

      <div className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md p-12 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Songs
        </h3>
        <Table />
      </div>
    </div>
  );
}
