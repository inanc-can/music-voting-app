import { PlaybackState, SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { supabase } from "./supabase";

var api: SpotifyApi = {} as SpotifyApi;

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL || "";

try {
  api = SpotifyApi.withUserAuthorization(CLIENT_ID, REDIRECT_URI, [
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
  ]);
} catch (error: any) {
  if (error.response && error.response.status === 503) {
    console.error("Service Unavailable: Please try again later.");
  } else {
    console.error("An error occurred during authorization:", error);
  }
}

export async function getTrack(id: string) {
  const track = await api.tracks.get(id);
  return track;
}

export async function playSong(id: string) {
  await api
    .makeRequest("PUT", "me/player/play", {
      uris: [`spotify:track:${id}`],
    })
    .then(async () => {
      await supabase.from("votesSongs").delete().eq("song_id", id);
      await supabase.from("VoteBox").delete().eq("song_id", id);
      console.log("Song has been played");
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function addQueue(id: string) {
  await api.player
    .addItemToPlaybackQueue(`spotify:track:${id}`)
    .catch((error) => {
      console.error(error);
    });
}

export async function duration(id: string): Promise<number> {
  try {
    let state = (await api.tracks.get(id)).duration_ms;
    return state;
  } catch (error) {
    console.error(error);
  }
  return 0;
}
