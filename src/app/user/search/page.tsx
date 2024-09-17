import SearchBar from "@/components/SearchBar";
import VoteTable from "@/components/Vote/VoteTable";
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
    </div>
  );
}
