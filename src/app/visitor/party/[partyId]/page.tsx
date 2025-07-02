"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SearchBar from "@/components/SearchBar";
import PartySearchBar from "@/components/PartySearchBar";
import ParticipantAvatars from "@/components/ParticipantAvatars";
import SignInButton from "@/components/SignInButton";
import VoteTable from "@/components/Vote/VoteTable";
import LeavePartyButton from "@/components/LeavePartyButton";
import { ArrowUp } from "lucide-react";
import LoadingComponent from "@/components/LoadingComponent";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function PartyPage() {
  const { partyId } = useParams() as { partyId: string };
  const searchParams = useSearchParams();
  const [party, setParty] = useState<{ id: number; name: string } | null>(null);
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [partyParticipantsCount, setPartyParticipantsCount] = useState(0);
  const [partyParticipants, setPartyParticipants] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  const [currentSong, setCurrentSong] = useState<{
    song_id: string;
    image: string;
    title: string;
    artist: string;
  } | null>(null);
  const [partySearchQuery, setPartySearchQuery] = useState("");
  const [isSpotifySearchLoading, setIsSpotifySearchLoading] = useState(false);
  const [isPartySearchLoading, setIsPartySearchLoading] = useState(false);

  const handleDrawerOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (open) {
      // This function will run when the drawer is opened
      console.log("Drawer was opened");
      // Fetch currently playing song when drawer opens
      fetchCurrentSong();
    }
  };

  const fetchCurrentSong = async () => {
    try {
      const response = await fetch('/api/spotify/currentSong');
      if (response.ok) {
        const songData = await response.json();
        // Note: The API currently returns just the URI, you may need to modify it
        // to return the full song data including image, title, artist
        console.log("Current song:", songData);
        // For now, we'll use placeholder data
        setCurrentSong({
          song_id: "placeholder_id",
          image: "https://upload.wikimedia.org/wikipedia/en/1/1b/Adele_-_21.png",
          title: "Song Name",
          artist: "Artist Name"
        });
      }
    } catch (error) {
      console.error("Error fetching current song:", error);
    }
  };
  const handleLeaveParty = () => {
    console.log("User has left the party");
    // Handle any additional logic after leaving the party
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    const fetchParty = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("parties")
        .select("id, name")
        .eq("id", partyId)
        .single();
      if (error) {
        console.error("Error fetching party:", error);
      } else {
        setParty(data);
      }
      setLoading(false);
    };

    fetchParty();
    // Also fetch current song on component mount
    fetchCurrentSong();
  }, [partyId]);

  async function getPartyParticipants(party_id: string) {
    console.log(party_id);
    try {
      // Get participants
      const { data: participantsData, error: participantsError } = await supabase
        .from("partyparticipants")
        .select("id, user_id")
        .eq("party_id", party_id);

      if (participantsError) {
        console.error("Error fetching participants:", participantsError);
        return 0;
      }

      if (participantsData && participantsData.length > 0) {
        // Create mock user data since we might not have profiles table
        const participantsWithProfiles = participantsData.map((participant, index) => ({
          ...participant,
          profiles: {
            id: participant.user_id,
            username: `User${index + 1}`,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.user_id}`,
            email: `user${index + 1}@example.com`
          }
        }));

        setPartyParticipants(participantsWithProfiles);
        return participantsData.length;
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
    <div className="min-h-screen min-w-screen relative">
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center mt-8 text-white">
            Welcome to {party?.name}
          </h1>
          <div className="my-4">
            <ParticipantAvatars participants={partyParticipants} maxVisible={3} />
          </div>
          <div className="mx-8 my-4">
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

          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 gap-4">
            <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange}>
              <DrawerTrigger className="bg-white text-black p-2 rounded-full animate-bounce">
                <ArrowUp size={24} />
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Are you bored?</DrawerTitle>
                  <DrawerDescription>
                    Let&apos;s see what is out there!
                  </DrawerDescription>
                  <div className="py-4">
                    <h3 className="text-base font-medium mb-2">
                      Currently Playing
                    </h3>
                    {currentSong ? (
                      <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                        <div className="w-16 h-16 bg-primary/20 rounded flex-shrink-0">
                          <img
                            src={currentSong.image}
                            alt="Album cover"
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-medium truncate">{currentSong.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {currentSong.artist}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                        <div className="w-16 h-16 bg-primary/20 rounded flex-shrink-0 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No song</span>
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-medium truncate">No song playing</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            Check back later
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </DrawerHeader>

                <DrawerFooter>
                  <SignInButton />
                  <LeavePartyButton onLeaveParty={handleLeaveParty} />
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </>
      )}
    </div>
  );
}
