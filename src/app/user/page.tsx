"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { duration, playSong } from "@/lib/spotify";
import { CreatePartyDialog } from "@/components/CreatePartyDialog";
import LogoutButton from "@/components/LogOutButton";
import { supabase } from "@/lib/supabase";
import JoinPartyDialog from "@/components/JoinPartyDialog";
import { useRouter } from "next/navigation";
import DeletePartyDialog from "@/components/DeletePartyDialog";
import LoadingComponent from "@/components/LoadingComponent";
import SharePartyDialog from "@/components/SharePartyDialog";
import { Switch } from "@/components/ui/switch";
import SearchBar from "@/components/SearchBar";
import Table from "@/components/Table";
import { pickWinnerSong } from "@/lib/song";
// Import dynamically
import dynamic from "next/dynamic";
import { MenuBar } from "@/components/menu-bar";

// Dynamic import with no SSR
const SearchResults = dynamic(() => import("@/components/SearchResults"), {
  ssr: false,
});

export default function HomeComponent() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [hasParty, sethasParty] = useState(false);
  const [inparty, setInParty] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [partyParticipantsCount, setPartyParticipantsCount] = useState(0);
  const [partyId, setPartyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const polling = useCallback(async () => {
    // Logic to pick a winner song
    const song = await pickWinnerSong(partyId);

    if (song) {
      const songDuration = await duration(song);

      // Play the song
      playSong(song);

      // Wait for the duration of the song before picking the next one
      setTimeout(polling, Number(songDuration));
    }
  }, [partyId]);

  async function getPartyParticipants(party_id: string) {
    console.log(party_id);
    try {
      const { data, error } = await supabase
        .from("partyparticipants")
        .select("id")
        .eq("party_id", party_id);

      if (data) {
        return data.length;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || "");
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
        setPartyId(data.id);
        setPartyName(data.name);
      } else {
        setInParty(false);
      }
    };
    fetchUser();
    setLoading(false);
  }, []);

  useEffect(() => {
    getPartyParticipants(partyId).then((participants) =>
      setPartyParticipantsCount(participants || 0)
    );
    const channel = supabase
      .channel("public:partyparticipants")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "partyparticipants" },
        (payload) => {
          getPartyParticipants(partyId).then((participants) =>
            setPartyParticipantsCount(participants || 0)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partyId]);

  return (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="space-y-6">
          <div>
            <div
              className="bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md p-6 rounded-lg
              flex-row space-y-6 md:flex justify-between items-center"
            >
              <div>
                {hasParty && (
                  <div className="flex flex-row space-x-4">
                    <div>
                                             <div className="flex items-center gap-3">
                         <p className="font-semibold text-2xl text-gray-200">
                           Welcome to {partyName}
                         </p>
                                                   <SharePartyDialog partyId={partyId} />
                       </div>
                      <p className="text-gray-300 font-normal text-xl">
                        Participants: {partyParticipantsCount}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Switch
                        checked={showSearchBar}
                        onCheckedChange={(checked) => setShowSearchBar(checked)}
                      />
                      <span className="text-gray-300 text-sm">
                        Show Search Bar
                      </span>
                    </div>
                  </div>
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
                <div className="">
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

                {!hasParty && (
                  <JoinPartyDialog
                    onJoinParty={(partyId) => {
                      console.log(partyId);
                      router.refresh();
                    }}
                  />
                )}
                <LogoutButton />
              </div>
            </div>
          </div>

          {hasParty && (
            <>
              {showSearchBar && (
                <div className="w-4/5 mx-auto">
                  <SearchBar placeholder="Search a Song" />
                  <Suspense fallback={<LoadingComponent />}>
                    <SearchResults partyId={partyId} />
                  </Suspense>
                </div>
              )}
              {!showSearchBar && <Table partyId={partyId} />}
            </>
          )}
          <MenuBar className="" />
        </div>
      )}
    </div>
  );
}
