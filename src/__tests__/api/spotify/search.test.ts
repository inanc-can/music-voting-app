import { NextRequest } from "next/server";
import { POST } from "../../../app/api/spotify/search/route";

describe("Search API", () => {
  it("should return the correct search results for a given search term", async () => {
    const searchTerm = "Imagine Dragons"; // Example search term
    const req = new NextRequest("http://localhost:3000/api/spotify/search", {
      method: "POST",
      body: JSON.stringify({ searchTerm }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data).toBeDefined(); // Assuming the response is defined
    expect(data.length).toBeGreaterThan(0); // Assuming there are search results
    expect(data[0]).toHaveProperty("song_id");
    expect(data[0]).toHaveProperty("image");
    expect(data[0]).toHaveProperty("title");
    expect(data[0]).toHaveProperty("artist");
  });
});
