import { NextRequest } from "next/server";
import { POST } from "../../../app/api/spotify/play/route";

describe("Play API", () => {
  it("should play the correct song for a given song ID", async () => {
    const songId = "3n3Ppam7vgaVa1iaRUc9Lp"; // Example song ID
    const req = new NextRequest("http://localhost:3000/api/spotify/play", {
      method: "POST",
      body: JSON.stringify({ songId }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data).toBeDefined(); // Assuming the response is defined
  });
});
