import { Vote } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

type VoteBox = {
  song_id: string;
  image: string;
  title: string;
  artist: string;
  votes?: number;
};

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

//Promise a VoteBox object
export async function POST(req: NextRequest) {
  const { songId } = await req.json();

  try {
    // Retrieve an access token
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body["access_token"]);

    // Perform the search
    const response = await spotifyApi.getTrack(songId);

    //Create a VoteBox object
    const track = response.body;
    const voteBox: VoteBox = {
      song_id: track.id,
      image: track.album.images[0].url,
      title: track.name,
      artist: track.artists[0].name,
    };

    return NextResponse.json(voteBox);
  } catch (error) {
    console.error("Error returning duration", error);
    return NextResponse.json(
      { error: "Failed to return duration" },
      { status: 500 }
    );
  }
}
