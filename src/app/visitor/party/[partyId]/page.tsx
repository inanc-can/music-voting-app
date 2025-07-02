"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SearchBar from "@/components/SearchBar";
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

export default function PartyPage() {
  const { partyId } = useParams() as { partyId: string };
  const searchParams = useSearchParams();
  const [party, setParty] = useState<{ id: number; name: string } | null>(null);
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [partyParticipantsCount, setPartyParticipantsCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (open) {
      // This function will run when the drawer is opened
      console.log("Drawer was opened");
      // You can add any logic you need here
      
      // For example: fetch currently playing song, refresh data, etc.

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
          <h2 className="text-xl text-center my-4 text-white">
            Participants:{partyParticipantsCount}
          </h2>
          <div className="mx-8 my-4">
            <SearchBar placeholder="Search a song" />
            <VoteTable
              query={query}
              currentPage={currentPage}
              partyId={partyId}
            />
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
                    <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                      <div className="w-16 h-16 bg-primary/20 rounded flex-shrink-0">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/en/1/1b/Adele_-_21.png"
                          alt="Album cover"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-medium truncate">Song Name</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          Artist Name
                        </p>
                      </div>
                    </div>
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
