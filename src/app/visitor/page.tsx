"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import JoinPartyDialog from "@/components/JoinPartyDialog";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";

export default function JoinOrSignIn() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        return;
      }
      if (session) {
        console.log("Session:", session);
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
