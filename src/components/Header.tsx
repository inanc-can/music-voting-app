// components/Header.tsx
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HomeIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  MusicIcon,
} from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-800 dark:text-white"
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] sm:w-[400px] bg-white dark:bg-gray-900 bg-opacity-80 backdrop-blur-lg"
        >
          <SheetHeader>
            <SheetTitle className="text-gray-800 dark:text-white">
              Menu
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-4 px-4 py-2">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  User Name
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  user@example.com
                </p>
              </div>
            </div>
            <Link href="/" passHref>
              <Button
                variant="ghost"
                className="justify-start text-gray-800 dark:text-white"
              >
                <HomeIcon className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/profile" passHref>
              <Button
                variant="ghost"
                className="justify-start text-gray-800 dark:text-white"
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link href="/settings" passHref>
              <Button
                variant="ghost"
                className="justify-start text-gray-800 dark:text-white"
              >
                <SettingsIcon className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="justify-start text-red-600 dark:text-red-400"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">
        Music Voting
      </h1>
      <MusicIcon className="h-6 w-6 text-gray-800 dark:text-white" />
    </header>
  );
}
