import { search } from "@/lib/spotify";
import ArticleItem from "@/components/ArticleItem";
import SongBox from "@/components/SongBox";
import SearchBar from "@/components/SearchBar";

export default async function SpotifyPage({
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
    <div>
      <div className="mx-8 my-4"></div>
    </div>
  );
}
