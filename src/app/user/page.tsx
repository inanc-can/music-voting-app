"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { duration, playSong } from "@/lib/spotify";
import { CreatePartyDialog } from "@/components/CreatePartyDialog";
import LogoutButton from "@/components/LogOutButton";
import { supabase } from "@/lib/supabase";
import JoinPartyDialog from "@/components/JoinPartyDialog";
import { useRouter, useSearchParams } from "next/navigation";
import DeletePartyDialog from "@/components/DeletePartyDialog";
import LoadingComponent from "@/components/LoadingComponent";
import SharePartyDialog from "@/components/SharePartyDialog";
import SearchBar from "@/components/SearchBar";
import PartySearchBar from "@/components/PartySearchBar";
import VoteTable from "@/components/Vote/VoteTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pickWinnerSong } from "@/lib/song";
import { MenuBar } from "@/components/menu-bar";
import ParticipantAvatars from "@/components/ParticipantAvatars";

function UserPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const [userId, setUserId] = useState("");
  const [hasParty, sethasParty] = useState(false);
  const [inparty, setInParty] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [partyParticipantsCount, setPartyParticipantsCount] = useState(0);
  const [partyParticipants, setPartyParticipants] = useState<any[]>([]);
  const [partyId, setPartyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");
  const [partySearchQuery, setPartySearchQuery] = useState("");
  const [isSpotifySearchLoading, setIsSpotifySearchLoading] = useState(false);
  const [isPartySearchLoading, setIsPartySearchLoading] = useState(false);

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
    try {
      if (!party_id) {
        setPartyParticipants([]);
        return 0;
      }

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      const { data: participantsData, error: participantsError } = await supabase
        .from("partyparticipants")
        .select("id, user_id")
        .eq("party_id", party_id);

      if (participantsError) {
        console.error("Error fetching participants:", participantsError);
        setPartyParticipants([]);
        return 0;
      }

      if (participantsData && participantsData.length > 0) {
        const participantsWithProfiles = participantsData.map((participant) => {
          if (currentUser && participant.user_id === currentUser.id) {
            const metadata = currentUser.user_metadata || {};
            return {
              ...participant,
              profiles: {
                id: participant.user_id,
                username: metadata.first_name
                  ? `${metadata.first_name} ${metadata.last_name}`
                  : currentUser.email?.split("@")[0] || "Anonymous",
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.user_id}`,
                email: currentUser.email || null,
                show_profile: metadata.show_profile !== false,
              },
            };
          }

          return {
            ...participant,
            profiles: {
              id: participant.user_id,
              username: "Anonymous",
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.user_id}`,
              email: null,
              show_profile: true,
            },
          };
        });

        setPartyParticipants(participantsWithProfiles);
        return participantsWithProfiles.length;
      }

      setPartyParticipants([]);
      return 0;
    } catch (error) {
      console.error("Error fetching data:", error);
      setPartyParticipants([]);
      return 0;
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
                      </div>
                      <p className="text-gray-300 font-normal text-xl">
                        Participants: {partyParticipantsCount}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex space-x-4">
                <SharePartyDialog partyId={partyId} partyName={partyName} />

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
            <div className="my-2">
              <ParticipantAvatars participants={partyParticipants} maxVisible={3} />
            </div>
          )}

          {hasParty && (
            <>
              <div className="w-4/5 mx-auto my-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-fit grid-cols-2 h-8 mx-auto">
                    <TabsTrigger value="current" className="text-xs px-3 py-1">Current</TabsTrigger>
                    <TabsTrigger value="search" className="text-xs px-3 py-1">Search</TabsTrigger>
                  </TabsList>

                  <TabsContent value="current" className="mt-4">
                    <PartySearchBar
                      placeholder="Search songs in this party"
                      onSearchChange={setPartySearchQuery}
                      initialValue={partySearchQuery}
                      onLoadingChange={setIsPartySearchLoading}
                    />
                    <VoteTable
                      query={partySearchQuery}
                      currentPage={currentPage}
                      partyId={partyId}
                      searchMode="party"
                      onLoadingChange={setIsPartySearchLoading}
                    />
                  </TabsContent>

                  <TabsContent value="search" className="mt-4">
                    <SearchBar
                      placeholder="Search all songs on Spotify"
                      onLoadingChange={setIsSpotifySearchLoading}
                    />
                    <VoteTable
                      query={query}
                      currentPage={currentPage}
                      partyId={partyId}
                      searchMode="spotify"
                      onLoadingChange={setIsSpotifySearchLoading}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function HomeComponent() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <UserPageContent />
    </Suspense>
  );
}
