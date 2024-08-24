// components/JoinPartyDialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogInIcon } from "lucide-react";
import { Party } from "../../types/party";

interface JoinPartyDialogProps {
  onJoinParty: (partyCode: string) => void;
}

export function JoinPartyDialog({ onJoinParty }: JoinPartyDialogProps) {
  const [open, setOpen] = useState(false);
  const [partyCode, setPartyCode] = useState("");

  const handleJoinParty = (e: React.FormEvent) => {
    e.preventDefault();
    onJoinParty(partyCode);
    setOpen(false);
    setPartyCode("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full h-32 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md text-gray-800 dark:text-white border border-gray-300 dark:border-white dark:border-opacity-20 hover:bg-opacity-100 dark:hover:bg-opacity-50 transition-all duration-300"
          size="lg"
        >
          <div className="flex flex-col items-center">
            <LogInIcon className="h-12 w-12 mb-2" />
            <span>Join Party</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join a Party</DialogTitle>
          <DialogDescription>
            Enter the party code to join an existing music voting party.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleJoinParty}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="party-code"
                value={partyCode}
                onChange={(e) => setPartyCode(e.target.value)}
                className="col-span-4"
                placeholder="Enter party code"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Join Party</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
