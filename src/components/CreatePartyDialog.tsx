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
import { supabase } from "@/lib/supabase";
interface CreatePartyDialogProps {
  onCreateParty: (partyDetails: { name: string }) => void;
}

// This function renders the dialog for creating a new party
export function CreatePartyDialog({ onCreateParty }: CreatePartyDialogProps) {
  const [open, setOpen] = useState(false);
  const [partyName, setPartyName] = useState("");

  // This function handles the creation of a new party
  const handleCreateParty = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: partyData, error: partyError } = await supabase
        .from("parties")
        .insert({
          name: partyName,
          user_id: user.id,
        })
        .select("id")
        .single();
      if (partyError) {
        console.error("Error creating party:", partyError);
      } else {
        const { data: participantData, error: participantError } =
          await supabase
            .from("partyparticipants")
            .insert({
              party_id: partyData.id,
              user_id: user.id,
            })
            .single();
        if (participantError) {
          console.error("Error adding owner as participant:", participantError);
        } else {
          onCreateParty({ name: partyName });
          setOpen(false);
          setPartyName("");
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <span>Create Party</span>
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
