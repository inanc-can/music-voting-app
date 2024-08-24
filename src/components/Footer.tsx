"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon, UserIcon, SettingsIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md text-gray-800 dark:text-white p-4">
      <nav className="flex justify-around">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon">
            <HomeIcon className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Button>
        </Link>
        <Link href="/profile" passHref>
          <Button variant="ghost" size="icon">
            <UserIcon className="h-6 w-6" />
            <span className="sr-only">Profile</span>
          </Button>
        </Link>
        <Link href="/settings" passHref>
          <Button variant="ghost" size="icon">
            <SettingsIcon className="h-6 w-6" />
            <span className="sr-only">Settings</span>
          </Button>
        </Link>
      </nav>
    </footer>
  );
}
