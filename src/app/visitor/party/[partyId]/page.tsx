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
  const { partyId } = useParams();
  const searchParams = useSearchParams();

  const [party, setParty] = useState<{ id: number; name: string } | null>(null);
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen min-w-screen relative">
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center my-8 text-white">
            Welcome to {party?.name}
          </h1>
          <div className="mx-8 my-4">
            <SearchBar placeholder="Search a song" />
            <VoteTable query={query} currentPage={currentPage} />
          </div>
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 gap-4">
            <Drawer>
              <DrawerTrigger className="bg-white text-black p-2 rounded-full animate-bounce">
                <ArrowUp size={24} />
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Are you bored?</DrawerTitle>
                  <DrawerDescription>
                    Let&apos;s see what is out there!
                  </DrawerDescription>
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
