"use client";
import SpotifyPlayer from "react-spotify-web-playback";

export default function Spotify() {
  return (
    <div>
      <SpotifyPlayer
        token="BQBIt13i_jCgUFcfVLE-sh9_9ExJKk2o3vjBbOBXhm7lG3A0XzFJ92PpWfBXdanGHFLPzrVdQPbjVZRh9_sAlha_28Ecpl1Y5YG1XaLeUAxAh4uK80vbB2dL1dTMLWwEtQQK2QpiKngM7PtzRlViOqojKkccHsOfhd652zI4Ito-Mgh8kXmGibJNwoeqrRzvKtdTodkJ_sxU1df2i66-YY9RneY5ZQEgykgdf-wC"
        uris={["spotify:artist:6HQYnRM4OzToCYPpVBInuU"]}
      />
    </div>
  );
}
