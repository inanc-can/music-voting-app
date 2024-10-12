"use client";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import VoteTable from "@/components/Vote/VoteTable";
import SignInButton from "@/components/SignInButton";
import { supabase } from "@/lib/supabase";

export default function Search({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const signInAnonymously = async () => {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error("Error during anonymous sign-in:", error.message);
      } else {
        console.log("User signed in anonymously");
      }
      setLoading(false);
    };

    signInAnonymously();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative min-h-screen">
      <div className="mx-8 my-4">
        <SearchBar placeholder="Search a song" />
        <VoteTable query={query} currentPage={currentPage} />
      </div>
      <SignInButton />
    </div>
  );
}
