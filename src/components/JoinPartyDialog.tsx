"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface JoinPartyDialogProps {
  onJoinParty: (partyId: number) => void;
}

export default function JoinPartyDialog({ onJoinParty }: JoinPartyDialogProps) {
  const [open, setOpen] = useState(false);
  const [parties, setParties] = useState<{ id: number; name: string }[]>([]);
  const [selectedParty, setSelectedParty] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchParties = async () => {
      const { data, error } = await supabase.from("parties").select("id, name");
      if (error) {
        console.error("Error fetching parties:", error);
      } else {
        setParties(data);
      }
    };

    const checkUserParty = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: partyParticipant, error } = await supabase
          .from("partyparticipants")
          .select("party_id")
          .eq("user_id", user.id)
          .single();
        if (partyParticipant) {
          router.refresh();
        }
      }
    };

    fetchParties();
    checkUserParty();
  }, [router]);

  const handleJoinParty = async (e: React.FormEvent) => {
    console.log("Joining party...");
    e.preventDefault();
    console.log("Selected party:", selectedParty);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && selectedParty) {
      const { data, error } = await supabase
        .from("partyparticipants")
        .insert({
          party_id: selectedParty,
          user_id: user.id,
        })
        .single();
      console.log(data);

      if (error) {
        console.error("Error joining party:", error);
      } else {
        onJoinParty(selectedParty);
        setOpen(false);
        setSelectedParty(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Join Party</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join a Party</DialogTitle>
          <DialogDescription>
            Select a party to join from the list below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleJoinParty}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="party-select" className="text-right">
                Party
              </Label>
              <Select
                value={selectedParty !== null ? String(selectedParty) : ""}
                onValueChange={(value) => setSelectedParty(Number(value))}
                required
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a party" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {parties.map((party) => (
                        <SelectItem key={party.id} value={String(party.id)}>
                          {party.name}
                        </SelectItem>
                      ))}
                    </SelectLabel>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
