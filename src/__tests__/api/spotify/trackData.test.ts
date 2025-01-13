import { NextRequest } from "next/server";
import { POST } from "../../../app/api/spotify/trackData/route";

describe("TrackData API", () => {
  it("should return the correct track data for a given song ID", async () => {
    const songId = "3n3Ppam7vgaVa1iaRUc9Lp"; // Example song ID
    const req = new NextRequest("http://localhost:3000/api/spotify/trackData", {
      method: "POST",
      body: JSON.stringify({ songId }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data).toBeDefined(); // Assuming the response is defined
    expect(data).toHaveProperty("song_id");
    expect(data).toHaveProperty("image");
    expect(data).toHaveProperty("title");
    expect(data).toHaveProperty("artist");
  });
});
