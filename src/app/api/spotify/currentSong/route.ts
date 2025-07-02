import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

type VoteBox = {
  song_id: string;
  image: string;
  title: string;
  artist: string;
  votes?: number;
};

// Create a new instance of the SpotifyWebApi object
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

//Promise a VoteBox object
export async function GET(req: NextRequest) {
  try {
    // Retrieve an access token
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body["access_token"]);

    // Perform the search
    const response = await spotifyApi.getMyCurrentPlayingTrack();

    // Create a VoteBox object from the current track
    const songUri = response.body.item?.uri;

    return NextResponse.json(songUri);
  } catch (error) {
    console.error("Error returning duration", error);
    return NextResponse.json(
      { error: "Failed to return duration" },
      { status: 500 }
    );
  }
}
