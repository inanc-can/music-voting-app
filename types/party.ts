// types/party.ts
export type Song = {
  id: string;
  title: string;
  artist: string;
  votes: number;
};

export type Member = {
  id: string;
  name: string;
  avatar?: string;
};

export type Party = {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  members: Member[];
};

export type PartyDetails = {
  name: string;
  description: string;
};
