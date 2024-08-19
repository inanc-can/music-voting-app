// pages/spotify.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

const Spotify = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(true);

  // Function to initiate the Spotify OAuth flow
  const redirectToSpotifyAuth = () => {
    const params = {
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      response_type: "code",
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
      scope: "user-read-playback-state user-modify-playback-state streaming", // Add more scopes as needed
    };

    const authUrl = `${SPOTIFY_AUTH_URL}?${new URLSearchParams(
      params
    ).toString()}`;
    window.location.href = authUrl;
  };

  // Function to fetch tokens using authorization code
  const fetchTokens = async (code: string) => {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.CLIENT_SECRET}`
        )}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.REDIRECT_URI!,
      }).toString(),
    });

    const data = await response.json();

    if (data.access_token && data.refresh_token) {
      // Store tokens in localStorage
      localStorage.setItem("spotify_access_token", data.access_token);
      localStorage.setItem("spotify_refresh_token", data.refresh_token);

      // Redirect to home page or another page in your app
      router.push("/");
    } else {
      console.error("Error fetching tokens:", data);
    }
  };

  // Function to refresh the access token using the refresh token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("spotify_refresh_token");

    if (!refreshToken) {
      console.error("No refresh token available");
      return;
    }

    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        )}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }).toString(),
    });

    const data = await response.json();

    if (data.access_token) {
      // Update access token in localStorage
      localStorage.setItem("spotify_access_token", data.access_token);
      return data.access_token;
    } else {
      console.error("Error refreshing access token:", data);
    }
  };

  // Check for authorization code and handle token exchange
  useEffect(() => {
    if (code) {
      fetchTokens(code);
    } else {
      redirectToSpotifyAuth();
    }
  }, [code]);

  // Example function to get access token, refreshing if necessary
  const getAccessToken = async () => {
    let accessToken = localStorage.getItem("spotify_access_token");

    if (!accessToken) {
      accessToken = await refreshAccessToken();
    }

    return accessToken;
  };

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = async () => {
      const token = await getAccessToken();

      const newPlayer = new window.Spotify.Player({
        name: "Web Playback SDK Quick Start Player",
        getOAuthToken: (cb) => {
          cb(token!);
        },
        volume: 0.5,
      });

      setPlayer(newPlayer);

      // Ready event, when the SDK is ready to play
      newPlayer.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
        console.log("Ready with Device ID", device_id);
      });

      // Player state change listener
      newPlayer.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setIsPaused(state.paused);

        const currentTrack = state.track_window.current_track;
        console.log("Currently Playing", currentTrack);
        console.log("Paused", state.paused);
      });

      // Connect to the player
      newPlayer.connect();
    };
  }, []);

  return (
    <div>
      <h1>Spotify OAuth & Web Playback SDK</h1>
      <p>
        If you see this page, you should be redirected to Spotify for
        authentication.
      </p>
      <div>
        {player && deviceId ? (
          <p>Player is ready on device {deviceId}</p>
        ) : (
          <p>Loading player...</p>
        )}
        <p>{isPaused ? "Playback is paused" : "Playback is playing"}</p>
      </div>
    </div>
  );
};

export default Spotify;
