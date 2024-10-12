"use client"
import SearchBar from "@/components/SearchBar";
import VoteTable from "@/components/Vote/VoteTable";
import SignInButton from "@/components/SignInButton";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default async function Search({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const { data: authData, error: authError } =
  await supabase.auth.signInAnonymously();

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
if (authError) {
  console.error("Error during anonymous sign-in:", authError.message);
} else {
  console.log(authData);
}
  return (
    <div className="relative min-h-screen">
      <div className="mx-8 my-4">
        <SearchBar placeholder="Search" />
        <VoteTable query={query} currentPage={currentPage} />
      </div>
      <SignInButton />
    </div>
  );
}
