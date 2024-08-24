// hooks/useActiveParty.ts
import { useState, useEffect } from "react";
import { Party } from "../../types/party";

export function useActiveParty() {
  const [activeParty, setActiveParty] = useState<Party | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedParty = localStorage.getItem("activeParty");
    if (storedParty) {
      setActiveParty(JSON.parse(storedParty));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      if (activeParty) {
        localStorage.setItem("activeParty", JSON.stringify(activeParty));
      } else {
        localStorage.removeItem("activeParty");
      }
    }
  }, [activeParty, isLoaded]);

  return [activeParty, setActiveParty, isLoaded] as const;
}
