"use client";
import SearchBar from "@/components/SearchBar";
import VoteTable from "@/components/Vote/VoteTable";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// This function renders the search page and handles the loading state
export default function Search() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchContent />
    </Suspense>
  );
}

// This function renders the loading state
function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="loader">Loading...</div>{" "}
      {/* You can replace this with your preferred loading component */}
    </div>
  );
}

// This function renders the search content and handles the search query
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  return (
    <div className="min-h-screen min-w-screen relative">
      <div className="mx-8 my-4">
        <SearchBar placeholder="Search a song" />
        <VoteTable query={query} currentPage={currentPage} />
      </div>
    </div>
  );
}
