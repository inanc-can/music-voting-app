"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignInButton() {
  const router = useRouter();

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
      <Button
        variant="secondary"
        onClick={() => router.push("visitor/sign-in")}
      >
        Sign In
      </Button>
    </div>
  );
}
