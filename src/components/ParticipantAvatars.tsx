"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Participant {
  id: string;
  user_id: string;
  profiles?: {
    id: string;
    username?: string;
    avatar_url?: string;
    email?: string;
  };
}

interface ParticipantAvatarsProps {
  participants: Participant[];
  maxVisible?: number;
}

export default function ParticipantAvatars({ 
  participants = [], 
  maxVisible = 3 
}: ParticipantAvatarsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const visibleParticipants = participants.slice(0, maxVisible);
  const remainingCount = participants.length - maxVisible;

  const getInitials = (username?: string, email?: string) => {
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "?";
  };

  const getDisplayName = (participant: Participant) => {
    return participant.profiles?.username || 
           participant.profiles?.email?.split('@')[0] || 
           `User ${participant.user_id.substring(0, 8)}`;
  };

  if (participants.length === 0) {
    return (
      <div className="text-center text-white/70 text-sm">
        <div className="flex justify-center items-center space-x-2">
          <Avatar className="border-2 border-white/30">
            <AvatarFallback className="bg-gray-600 text-white/70 text-xs">
              ?
            </AvatarFallback>
          </Avatar>
          <span>No participants yet</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="flex -space-x-3">
        {visibleParticipants.map((participant, index) => (
          <Avatar 
            key={participant.id} 
            className="border-3 border-white hover:z-10 transition-transform hover:scale-110 cursor-pointer shadow-lg"
            onClick={() => setIsDialogOpen(true)}
          >
            <AvatarImage 
              src={participant.profiles?.avatar_url} 
              alt={getDisplayName(participant)}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
              {getInitials(participant.profiles?.username, participant.profiles?.email)}
            </AvatarFallback>
          </Avatar>
        ))}
        
        {remainingCount > 0 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Avatar className="border-3 border-white bg-gray-600 hover:bg-gray-500 cursor-pointer transition-all hover:scale-110 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-700 text-white text-xs font-semibold">
                  +{remainingCount}
                </AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Party Participants ({participants.length})</DialogTitle>
                <DialogDescription>
                  Everyone who&apos;s currently in this party
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <Avatar className="h-10 w-10 shadow-md">
                        <AvatarImage 
                          src={participant.profiles?.avatar_url} 
                          alt={getDisplayName(participant)}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                          {getInitials(participant.profiles?.username, participant.profiles?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getDisplayName(participant)}
                        </p>
                        {participant.profiles?.email && (
                          <p className="text-xs text-gray-500 truncate">
                            {participant.profiles.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {participants.length <= maxVisible && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="text-white/90 text-sm hover:text-white transition-colors ml-3 font-medium">
              {participants.length} participant{participants.length !== 1 ? 's' : ''}
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Party Participants ({participants.length})</DialogTitle>
              <DialogDescription>
                Everyone who&apos;s currently in this party
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Avatar className="h-10 w-10 shadow-md">
                      <AvatarImage 
                        src={participant.profiles?.avatar_url} 
                        alt={getDisplayName(participant)}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                        {getInitials(participant.profiles?.username, participant.profiles?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getDisplayName(participant)}
                      </p>
                      {participant.profiles?.email && (
                        <p className="text-xs text-gray-500 truncate">
                          {participant.profiles.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
