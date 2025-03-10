import { supabase } from "@/lib/supabase";

export async function getSongsVotes(song_id: string, party_id: string) {
  try {
    const { data, error } = await supabase
      .from("votesSongs")
      .select("song_id")
      .eq("song_id", song_id)
      .eq("partyId", party_id);

    if (data) {
      return data.length;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function pickWinnerSong(
  party_id: string
): Promise<string | undefined> {
  try {
    const { data, error } = await supabase
      .from("votesSongs")
      .select("song_id")
      .eq("party_id", party_id);

    if (data) {
      const counts = data.reduce(
        (acc: { [x: string]: any }, val: { song_id: string | number }) => {
          acc[val.song_id] = (acc[val.song_id] || 0) + 1;
          return acc;
        },
        {}
      );

      const mostCommonSongId = Object.keys(counts).reduce((a, b) =>
        counts[a] > counts[b] ? a : b
      );

      return mostCommonSongId;
    }
  } catch (error) {
    throw error;
  }
}
