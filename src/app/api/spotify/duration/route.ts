import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

// Create a new instance of the SpotifyWebApi object
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Handle POST requests to retrieve the duration of a song
export async function POST(req: NextRequest) {
  const { songId } = await req.json();

  try {
    // Retrieve an access token
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body["access_token"]);

    // Perform the search to get the track duration
    const response = (await spotifyApi.getTrack(songId)).body.duration_ms;

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error returning duration", error);
    return NextResponse.json(
      { error: "Failed to return duration" },
      { status: 500 }
    );
  }
}
