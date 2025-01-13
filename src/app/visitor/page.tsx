"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import JoinPartyDialog from "@/components/JoinPartyDialog";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

// This function renders the visitor page
export default function VisitorPage() {
  const router = useRouter();

  useEffect(() => {
    // This function fetches the session and handles anonymous sign-in if the session is null
    const fetchSession = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        return;
      }
      if (session.session == null) {
        console.log("Session is null:", session);
        const { data: anonSession, error } =
          await supabase.auth.signInAnonymously();
        if (error) {
          console.error("Error signing in anonymously:", error.message);
          return;
        }
        console.log("Anon session:", anonSession);
        // Handle the null session case here
      } else {
        console.log("Session found:", session);
        // Handle the valid session case here
      }
    };
    fetchSession();
  }, []);

  const handleSignIn = () => {
    router.push("/visitor/sign-in");
  };

  const handleJoinParty = (partyId: number) => {
    console.log(`Joined party with ID: ${partyId}`);
    router.push(`/party/${partyId}`);
    // Redirect to the party page or handle the party joining logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <h1 className="text-3xl font-bold text-white mb-8">
        Join a Party or Sign In
      </h1>
      <div className="flex gap-4">
        <Button variant="secondary" onClick={handleSignIn}>
          Sign In
        </Button>
        <JoinPartyDialog onJoinParty={handleJoinParty} />
      </div>
    </div>
  );
}
