import SearchBar from "@/components/SearchBar";
import VoteTable from "@/components/Vote/VoteTable";
import SignInButton from "@/components/SignInButton";
import { supabase } from "@/lib/supabase";
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

  if (authError) {
    console.error("Error during anonymous sign-in:", authError.message);
  } else {
    console.log(authData);
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
