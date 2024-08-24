import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Profile() {
  return (
    <div className="space-y-6 text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold">Your Profile</h2>
      <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md p-4 rounded-lg">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder-avatar.jpg" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold">User Name</h3>
          <p className="text-gray-600 dark:text-gray-300">user@example.com</p>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Your Stats</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">15</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Parties Joined
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">87</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Songs Voted
            </p>
          </div>
        </div>
      </div>
      <Button className="w-full bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-30 backdrop-blur-md text-gray-800 dark:text-white border border-gray-300 dark:border-white dark:border-opacity-20 hover:bg-opacity-100 dark:hover:bg-opacity-50 transition-all duration-300">
        Edit Profile
      </Button>
    </div>
  );
}
