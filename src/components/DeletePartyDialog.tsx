// The Button and the Dialog for the owner of a party to delete their party
import {
  Dialog,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeletePartyDialogProps {
  partyId: string;
  onDeleteParty: () => void;
}

export default function DeletePartyDialog({
  partyId,
  onDeleteParty,
}: DeletePartyDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDeleteParty = async () => {
    const { data, error } = await supabase
      .from("parties")
      .delete()
      .eq("id", partyId);

    const { data: partyParticipants, error: partyParticipantsError } =
      await supabase.from("partyparticipants").delete().eq("party_id", partyId);

    if (error || partyParticipantsError) {
      console.error("Error deleting party:", error);
    } else {
      onDeleteParty();
      setOpen(false);
      router.push("/");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)} variant={"destructive"}>
            Delete Party
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Delete Party</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this party?
          </DialogDescription>
          <DialogFooter>
            <Button onClick={handleDeleteParty}>Delete</Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
