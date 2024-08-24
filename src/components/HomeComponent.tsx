// components/HomeClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCodeIcon, HeadphonesIcon } from "lucide-react";
import { CreatePartyDialog } from "@/components/CreatePartyDialog";
import { ActivePartyView } from "@/components/ActivePartyView";
import { Party, PartyDetails } from "../../types/party";
import { useActiveParty } from "@/hooks/useActiveParty";
// This would typically come from your backend or state management solution
const mockParty: Party = {
  id: "1",
  name: "Friday Night Jams",
  description: "Vote for your favorite tracks to play next!",
  songs: [
    { id: "1", title: "Bohemian Rhapsody", artist: "Queen", votes: 10 },
    { id: "2", title: "Stairway to Heaven", artist: "Led Zeppelin", votes: 8 },
    { id: "3", title: "Hotel California", artist: "Eagles", votes: 6 },
  ],
  members: [
    { id: "1", name: "Alice", avatar: "/avatar1.jpg" },
    { id: "2", name: "Bob", avatar: "/avatar2.jpg" },
    { id: "3", name: "Charlie", avatar: "/avatar3.jpg" },
  ],
};

export default function HomeComponent() {
  const router = useRouter();
  const [activeParty, setActiveParty, isLoaded] = useActiveParty();

  const handleCreateParty = (partyDetails: PartyDetails) => {
    const newParty = {
      ...mockParty,
      name: partyDetails.name,
      description: partyDetails.description,
    };
    setActiveParty(newParty);
  };

  const handleLeaveParty = () => {
    setActiveParty(null);
    router.push("/");
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (activeParty) {
    return (
      <ActivePartyView party={activeParty} onLeaveParty={handleLeaveParty} />
    );
  }
  return (
    <div className="space-y-6 p-6">
      <div className="text-left py-4 space-y-4">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
          Welcome İnanç
        </h2>
        <p className="text-gray-600 dark:text-gray-300 ">
          Join a party or create your own to start voting on tracks.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          className="w-full h-32 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md text-gray-800 dark:text-white border border-gray-300 dark:border-white dark:border-opacity-20 hover:bg-opacity-100 dark:hover:bg-opacity-50 transition-all duration-300"
          size="lg"
        >
          <div className="flex flex-col items-center">
            <QrCodeIcon className="h-12 w-12 mb-2" />
            <span>Scan QR</span>
          </div>
        </Button>
        <CreatePartyDialog onCreateParty={handleCreateParty} />
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-100 dark:bg-gray-900 px-2 text-gray-600 dark:text-gray-400">
            Or
          </span>
        </div>
      </div>
      <Input
        className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-white dark:border-opacity-20"
        placeholder="Enter party link or code"
        type="text"
      />
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Recent Parties
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="w-full h-32 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md text-gray-800 dark:text-white border border-gray-300 dark:border-white dark:border-opacity-20 hover:bg-opacity-100 dark:hover:bg-opacity-50 transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              <HeadphonesIcon className="h-12 w-12 mb-2" />
              <span className="text-sm">Friday Night Mix</span>
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full h-32 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md text-gray-800 dark:text-white border border-gray-300 dark:border-white dark:border-opacity-20 hover:bg-opacity-100 dark:hover:bg-opacity-50 transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              <HeadphonesIcon className="h-12 w-12 mb-2" />
              <span className="text-sm">Chill Vibes Only</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
