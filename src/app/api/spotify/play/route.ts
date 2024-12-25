import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function POST(req: NextRequest) {
  const { songId } = await req.json();

  try {
    // Retrieve an access token
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body["access_token"]);

    // Cancel the repeat mode
    await spotifyApi.setRepeat("off");

    // Perform the play
    const response = await spotifyApi.play(songId);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error playing song", error);
    return NextResponse.json(
      { error: "Failed to play the song" },
      { status: 500 }
    );
  }
}
