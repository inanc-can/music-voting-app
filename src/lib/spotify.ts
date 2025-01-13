import { SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { supabase } from "./supabase";
import { toast } from "sonner";
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

export async function getSongData(id: string) {
  try {
    const response = await fetch("/api/spotify/trackData", {
      method: "POST",
      body: JSON.stringify({ songId: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("An error occurred while searching", error);
  }
}

export async function playSong(id: string): Promise<boolean> {
  try {
    await api.makeRequest("PUT", "me/player/play", {
      uris: [`spotify:track:${id}`],
    });

    // Delete votes only if play was successful
    await supabase.from("votesSongs").delete().eq("song_id", id);
    toast.success("Playing song");
    return true;
  } catch (error: any) {
    if (error.status === 404 || error.reason === "NO_ACTIVE_DEVICE") {
      toast.error(
        "No active Spotify device found. Please open Spotify and try again."
      );
    } else if (error.status === 401) {
      toast.error("Not authorized. Please login to Spotify again.");
    } else if (error.status === 403) {
      toast.error("Premium account required to control playback.");
    } else {
      toast.error("Failed to play song. Please try again.");
    }
    console.error("PlaySong Error:", error);
    return false;
  }
}

export async function addQueue(id: string): Promise<boolean> {
  try {
    await api.player.addItemToPlaybackQueue(`spotify:track:${id}`);
    toast.success("Added to queue");
    return true;
  } catch (error: any) {
    console.error("AddQueue Error:", error);
    if (error.status === 404 || error.reason === "NO_ACTIVE_DEVICE") {
      toast.error(
        "No active Spotify device found. Please open Spotify and try again."
      );
    } else if (error.status === 401) {
      toast.error("Not authorized. Please login to Spotify again.");
    } else if (error.status === 403) {
      toast.error("Premium account required to modify queue.");
    } else {
      toast.error(error || "Failed to add to queue. Please try again.");
    }
    console.error("AddQueue Error:", error);
    return false;
  }
}

export async function duration(id: string): Promise<number> {
  try {
    let state = (await api.tracks.get(id)).duration_ms;
    return state;
  } catch (error) {
    toast.error("Failed to get duration");
    console.error(error);
  }
  return 0;
}
