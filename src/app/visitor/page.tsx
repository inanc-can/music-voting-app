"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import JoinPartyDialog from "@/components/JoinPartyDialog";
import SignUpDialog from "@/components/SignUpDialog";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// This function renders the visitor page
export default function VisitorPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // This function fetches the session and handles anonymous sign-in if the session is null
    const fetchSession = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        return;
      }
      
      // Check if user is already authenticated (not anonymous)
      if (session.session && !session.session.user.is_anonymous) {
        console.log("Authenticated user session found:", session.session.user.email);
        setIsAuthenticated(true);
        setUserEmail(session.session.user.email || "");
        // Don't create anonymous session for authenticated users
        return;
      }
      
      // Only create anonymous session if there's no existing session AND no authenticated user
      if (!session.session) {
        console.log("No session found, checking if we should create anonymous session");
        
        // Double-check that there's no authenticated user before creating anonymous
        const { data: { user } } = await supabase.auth.getUser();
        if (user && !user.is_anonymous) {
          console.log("Found authenticated user, not creating anonymous session");
          setIsAuthenticated(true);
          setUserEmail(user.email || "");
          return;
        }
        
        // Wait a bit to see if a sign-in process is happening
        console.log("Waiting to see if sign-in process is happening...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check again after waiting
        const { data: { user: userAfterWait } } = await supabase.auth.getUser();
        if (userAfterWait && !userAfterWait.is_anonymous) {
          console.log("Found authenticated user after waiting, not creating anonymous session");
          setIsAuthenticated(true);
          setUserEmail(userAfterWait.email || "");
          return;
        }
        
        // Check if there are any ongoing auth operations
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession && !currentSession.user.is_anonymous) {
          console.log("Found authenticated session after waiting, not creating anonymous session");
          setIsAuthenticated(true);
          setUserEmail(currentSession.user.email || "");
          return;
        }
        
        console.log("No authenticated user found, creating anonymous session");
        const { data: anonSession, error: anonError } =
          await supabase.auth.signInAnonymously();
        if (anonError) {
          console.error("Error signing in anonymously:", anonError.message);
          return;
        }
        console.log("Anonymous session created:", anonSession);
      } else if (session.session && session.session.user.is_anonymous) {
        console.log("Anonymous session already exists:", session);
      }
    };
    
    fetchSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user && !session.user.is_anonymous) {
        console.log("User signed in:", session.user.email);
        setIsAuthenticated(true);
        setUserEmail(session.user.email || "");
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setIsAuthenticated(false);
        setUserEmail("");
      } else if (event === 'INITIAL_SESSION' && session?.user && !session.user.is_anonymous) {
        console.log("Initial authenticated session found:", session.user.email);
        setIsAuthenticated(true);
        setUserEmail(session.user.email || "");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = () => {
    router.push("/visitor/sign-in");
  };

  const handleJoinParty = (partyId: number) => {
    console.log(`Joined party with ID: ${partyId}`);
    console.log("Current auth state - isAuthenticated:", isAuthenticated, "userEmail:", userEmail);
    router.push(`/visitor/party/${partyId}`);
    // Redirect to the party page or handle the party joining logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {isAuthenticated ? (
        <>
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome back!
          </h1>
          <p className="text-white/70 mb-8">
            Signed in as {userEmail}
          </p>
          <div className="flex gap-4">
            <JoinPartyDialog onJoinParty={handleJoinParty} />
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-white mb-8">
            Join a Party or Sign In
          </h1>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={handleSignIn}>
              Sign In
            </Button>
            <SignUpDialog />
            <JoinPartyDialog onJoinParty={handleJoinParty} />
          </div>
        </>
      )}
    </div>
  );
}
