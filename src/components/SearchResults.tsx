"use client";

import { useSearchParams } from "next/navigation";
import VoteTable from "@/components/Vote/VoteTable";

export default function SearchResults({ partyId }: { partyId: string }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  return (
    <VoteTable query={query} currentPage={currentPage} partyId={partyId} />
  );
}
