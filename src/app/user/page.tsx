"use client";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useSongVotes } from "@/hooks/useSongVotes";
import { duration, playSong } from "@/lib/spotify";
import { Table } from "@/components/Table";
import { CreatePartyDialog } from "@/components/CreatePartyDialog";
import LogoutButton from "@/components/LogOutButton";
import { supabase } from "@/lib/supabase";
import JoinPartyDialog from "@/components/JoinPartyDialog";
import { useRouter } from "next/navigation";
import DeletePartyDialog from "@/components/DeletePartyDialog";

export default function HomeComponent() {
  const { pickWinnerSong } = useSongVotes();
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [hasParty, sethasParty] = useState(false);
  const [inparty, setInParty] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [partyParticipantsCount, setPartyParticipantsCount] = useState(0);
  const [partyId, setPartyId] = useState("");
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
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || "");
      console.log("User ID", user?.id);
      if (!user) {
        return;
      }

      const { data, error } = await supabase
        .from("parties")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (data) {
        sethasParty(true);
        console.log("User in party", data);
        setPartyId(data.id);
        setPartyName(data.name);
        const { data: partyParticipants, error } = await supabase
          .from("partyparticipants")
          .select("party_id")
          .eq("party_id", data.id);
        console.log("Party participants", partyParticipants);
        setPartyParticipantsCount(partyParticipants?.length || 0);
      } else {
        setInParty(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div
          className="bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md p-6 rounded-lg
        flex-row space-y-6 md:flex justify-between items-center"
        >
          <div>
            {hasParty && (
              <>
                <p className="font-semibold text-xl text-gray-200">
                  Welcome to {partyName}
                </p>
                <p className="text-gray-300 font-normal">
                  Participants: {partyParticipantsCount}
                </p>
              </>
            )}
          </div>
          <div className="flex space-x-4">
            {!hasParty && (
              <CreatePartyDialog
                onCreateParty={(partyDetails) => {
                  console.log(partyDetails);
                  router.refresh();
                }}
              />
            )}
            {hasParty && (
              <DeletePartyDialog
                partyId={partyId}
                onDeleteParty={() => {
                  router.refresh();
                }}
              />
            )}

            <JoinPartyDialog
              onJoinParty={(partyId) => {
                console.log(partyId);
                router.refresh();
              }}
            />
            <LogoutButton />
          </div>
        </div>
      </div>

      {hasParty && (
        <>
          <Table />
          <div className="absolute bottom-24 left-0 right-0 flex justify-center">
            {!playing && (
              <Button
                variant={"secondary"}
                onClick={() => {
                  setPlaying(true);
                }}
              >
                Start the Party
              </Button>
            )}
            {playing && (
              <Button
                variant={"secondary"}
                onClick={() => {
                  setPlaying(false);
                }}
              >
                Stop the Party
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
