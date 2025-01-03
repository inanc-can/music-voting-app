"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

interface LeavePartyButtonProps {
  onLeaveParty: () => void;
}

export default function LeavePartyButton({
  onLeaveParty,
}: LeavePartyButtonProps) {
  const [open, setOpen] = useState(false);
  const [party, setParty] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    const fetchParty = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("partyparticipants")
          .select("party_id")
          .eq("user_id", user.id)
          .single();
        if (error) {
          console.error("Error fetching party:", error);
        } else {
          const { data: partyData, error: partyError } = await supabase
            .from("parties")
            .select("id, name")
            .eq("id", data.party_id)
            .single();
          if (partyError) {
            console.error("Error fetching party details:", partyError);
          } else {
            setParty(partyData);
          }
        }
      }
    };

    fetchParty();
  }, []);

  const handleLeaveParty = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && party) {
      // Delete user's votes from votesSongs table
      const { error: votesError } = await supabase
        .from("votesSongs")
        .delete()
        .eq("user_id", user.id);
      if (votesError) {
        console.error("Error deleting votes:", votesError);
      }

      // Delete user from partyparticipants table
      const { error } = await supabase
        .from("partyparticipants")
        .delete()
        .eq("party_id", party.id)
        .eq("user_id", user.id);
      if (error) {
        console.error("Error leaving party:", error);
      } else {
        setOpen(false);
        setParty(null);
        onLeaveParty();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Leave Party</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave Party</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave the party {party?.name}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleLeaveParty}>
            Leave Party
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
