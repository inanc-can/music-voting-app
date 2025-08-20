"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignInButton() {
  const router = useRouter();

  return (
    <Button variant="secondary" onClick={() => router.push("/visitor/sign-in")}>
      Sign In
    </Button>
  );
}
