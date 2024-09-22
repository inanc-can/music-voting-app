"use client";
import React, { useState } from "react";

type VoteBox = {
  song_id: string;
  image: string;
  title: string;
  artist: string;
  votes?: number;
};

const TestPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<VoteBox[]>([]);

  const handleSearch = async () => {
    try {
      const response = await fetch("/api/spotify/search", {
        method: "POST",
        body: JSON.stringify({ searchTerm }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error("Failed to fetch search results");
      }
    } catch (error) {
      console.error("An error occurred while searching", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {searchResults.map((track) => (
          <div key={track.song_id}>
            <img src={track.image} alt={track.title} />
            <div>{track.title}</div>
            <div>{track.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
