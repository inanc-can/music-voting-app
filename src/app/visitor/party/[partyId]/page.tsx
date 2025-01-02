"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SearchBar from "@/components/SearchBar";
import SignInButton from "@/components/SignInButton";
import VoteTable from "@/components/Vote/VoteTable";

export default function PartyPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const { partyId } = useParams();
  const [party, setParty] = useState<{ id: number; name: string } | null>(null);
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  useEffect(() => {
    const fetchParty = async () => {
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
    };

    fetchParty();
  }, [partyId]);

  return (
    <div className="min-h-screen min-w-screen relative">
      <h1 className="text-3xl font-bold text-center my-8 text-white">
        Welcome to {party?.name}
      </h1>
      <div className="mx-8 my-4">
        <SearchBar placeholder="Search a song" />
        <VoteTable query={query} currentPage={currentPage} />
      </div>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <SignInButton />
      </div>
    </div>
  );
}
