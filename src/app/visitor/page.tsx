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
  // Check if the user is already authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // If the user is not authenticated, sign in anonymously
  if (!user) {
    const { data: authData, error: authError } =
      await supabase.auth.signInAnonymously();

    if (authError) {
      console.error("Error during anonymous sign-in:", authError.message);
    } else {
      console.log("Anonymous user signed in:", authData);
    }
  } else {
    console.log("User is already authenticated:", user);
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
