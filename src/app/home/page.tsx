import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

import {
  QrCodeIcon,
  HomeIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  MusicIcon,
  PlusCircleIcon,
  HeadphonesIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
export default function HomePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
        Welcome to Music Voting
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-center">
        Join a party or create your own to start voting on tracks.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Button
          className="w-full h-32 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md text-gray-800 dark:text-white border border-gray-300 dark:border-white dark:border-opacity-20 hover:bg-opacity-100 dark:hover:bg-opacity-50 transition-all duration-300"
          size="lg"
        >
          <div className="flex flex-col items-center">
            <QrCodeIcon className="h-12 w-12 mb-2" />
            <span>Scan QR</span>
          </div>
        </Button>
        <Button
          className="w-full h-32 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md text-gray-800 dark:text-white border border-gray-300 dark:border-white dark:border-opacity-20 hover:bg-opacity-100 dark:hover:bg-opacity-50 transition-all duration-300"
          size="lg"
        >
          <div className="flex flex-col items-center">
            <PlusCircleIcon className="h-12 w-12 mb-2" />
            <span>Create Party</span>
          </div>
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-100 dark:bg-gray-900 px-2 text-gray-600 dark:text-gray-400">
            Or
          </span>
        </div>
      </div>
      <Input
        className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-white dark:border-opacity-20"
        placeholder="Enter party link or code"
        type="text"
      />
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Recent Parties
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="w-full h-32 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md text-gray-800 dark:text-white border border-gray-300 dark:border-white dark:border-opacity-20 hover:bg-opacity-100 dark:hover:bg-opacity-50 transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              <HeadphonesIcon className="h-12 w-12 mb-2" />
              <span className="text-sm">Friday Night Mix</span>
            </div>
          </Button>
          <Button
            variant="outline"
            className="w-full h-32 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md text-gray-800 dark:text-white border border-gray-300 dark:border-white dark:border-opacity-20 hover:bg-opacity-100 dark:hover:bg-opacity-50 transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              <HeadphonesIcon className="h-12 w-12 mb-2" />
              <span className="text-sm">Chill Vibes Only</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
