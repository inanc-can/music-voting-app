// components/CreatePartyDialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";
import { PartyDetails } from "../../types/party";

interface CreatePartyDialogProps {
  onCreateParty: (partyDetails: PartyDetails) => void;
}

export function CreatePartyDialog({
  onCreateParty,
}: {
  onCreateParty: (partyDetails: { name: string; description: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [partyDescription, setPartyDescription] = useState("");

  const handleCreateParty = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateParty({ name: partyName, description: partyDescription });
    setOpen(false);
    setPartyName("");
    setPartyDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full h-32 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md text-gray-800 dark:text-white border border-gray-300 dark:border-white dark:border-opacity-20 hover:bg-opacity-100 dark:hover:bg-opacity-50 transition-all duration-300"
          size="lg"
        >
          <div className="flex flex-col items-center">
            <PlusCircleIcon className="h-12 w-12 mb-2" />
            <span>Create Party</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Party</DialogTitle>
          <DialogDescription>
            Enter the details for your new music voting party.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateParty}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="party-name" className="text-right">
                Name
              </Label>
              <Input
                id="party-name"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Party</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
