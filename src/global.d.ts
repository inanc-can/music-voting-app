// global.d.ts

interface Window {
  onSpotifyWebPlaybackSDKReady: () => void;
  Spotify: {
    Player: typeof SpotifyPlayer;
  };
}

declare class SpotifyPlayer {
  constructor(options: {
    name: string;
    getOAuthToken: (callback: (token: string) => void) => void;
    volume?: number;
  });

  connect(): Promise<boolean>;
  disconnect(): void;

  addListener(
    event: "ready",
    callback: (args: { device_id: string }) => void
  ): boolean;

  addListener(
    event: "player_state_changed",
    callback: (state: Spotify.PlaybackState) => void
  ): boolean;

  removeListener(event: "ready" | "player_state_changed"): boolean;
}

// Extend the Spotify namespace for PlaybackState
declare namespace Spotify {
  interface PlaybackState {
    paused: boolean;
    track_window: {
      current_track: {
        name: string;
        artists: { name: string }[];
        album: { name: string };
      };
    };
  }
}
