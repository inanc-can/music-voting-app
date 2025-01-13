import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function POST(req: NextRequest) {
  const { searchTerm } = await req.json();

  try {
    // Retrieve an access token
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body["access_token"]);

    // Perform the search
    const response = await spotifyApi.searchTracks(searchTerm);
    const results = response.body.tracks?.items.map((track) => ({
      song_id: track.id,
      image: track.album.images[0]?.url,
      title: track.name,
      artist: track.artists[0].name,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error performing search:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
