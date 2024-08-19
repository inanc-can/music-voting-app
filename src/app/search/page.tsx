import PlayBox from "@/components/PlayBar";
import SearchBar from "@/components/SearchBar";
import VoteBox from "@/components/Vote/VoteBox";
import VoteTable from "@/components/Vote/VoteTable";
import VoteBar from "@/components/Vote/VoteBar";
import NavBar from "@/components/NavBar";

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

  return (
    <div className="min-h-screen min-w-screen relative">
      <div className="mx-8 my-4">
        <SearchBar placeholder="Search a song" />
        <VoteTable query={query} currentPage={currentPage} />
      </div>
      <NavBar />
    </div>
  );
}
