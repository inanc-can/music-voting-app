// app/party/page.tsx
"use client";

import { useEffect } from "react";
import { ActivePartyView } from "@/components/ActivePartyView";
import { useActiveParty } from "@/hooks/useActiveParty";
import { useRouter } from "next/navigation";

export default function PartyPage() {
  const router = useRouter();
  const [activeParty, setActiveParty, isLoaded] = useActiveParty();

  useEffect(() => {
    if (isLoaded && !activeParty) {
      router.push("/");
    }
  }, [isLoaded, activeParty, router]);

  const handleLeaveParty = () => {
    setActiveParty(null);
    router.push("/");
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!activeParty) {
    return <div>No active party</div>;
  }

  return (
    <ActivePartyView party={activeParty} onLeaveParty={handleLeaveParty} />
  );
}
