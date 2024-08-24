"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(theme === "dark");
  return (
    <div className="space-y-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold">Settings</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md p-4 rounded-lg">
          <span>Dark Mode</span>
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            className="data-[state=checked]:bg-purple-600"
          />
        </div>
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md p-4 rounded-lg">
          <span>Notifications</span>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-white dark:border-opacity-20"
          >
            Manage
          </Button>
        </div>
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md p-4 rounded-lg">
          <span>Privacy</span>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-white dark:border-opacity-20"
          >
            Settings
          </Button>
        </div>
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md p-4 rounded-lg">
          <span>Connected Accounts</span>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-white dark:border-opacity-20"
          >
            Manage
          </Button>
        </div>
      </div>
      <Button className="w-full bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md text-gray-800 dark:text-white border border-gray-300 dark:border-white dark:border-opacity-20 hover:bg-opacity-100 dark:hover:bg-opacity-50 transition-all duration-300">
        Save Changes
      </Button>
    </div>
  );
}
