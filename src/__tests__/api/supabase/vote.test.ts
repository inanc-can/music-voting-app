import { NextRequest } from "next/server";
import { POST } from "../../../app/api/supabase/vote/route";

describe("Vote API", () => {
  it("should add a vote correctly for a given song ID and user ID", async () => {
    const userId = "user123"; // Example user ID
    const songId = "song123"; // Example song ID
    const req = new NextRequest("http://localhost:3000/api/supabase/vote", {
      method: "POST",
      body: JSON.stringify({ user_id: userId, song_id: songId }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data).toBeDefined(); // Assuming the response is defined
    expect(data.message).toBe("Vote added successfully"); // Assuming the vote is added successfully
  });
});
