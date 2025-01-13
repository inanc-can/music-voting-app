import { NextRequest } from "next/server";
import { POST } from "../../../app/api/spotify/duration/route";

describe("Duration API", () => {
  it("should return the correct duration for a given song ID", async () => {
    const songId = "3n3Ppam7vgaVa1iaRUc9Lp"; // Example song ID
    const req = new NextRequest("http://localhost:3000/api/spotify/duration", {
      method: "POST",
      body: JSON.stringify({ songId }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data).toBeGreaterThan(0); // Assuming the duration is greater than 0
  });
});
